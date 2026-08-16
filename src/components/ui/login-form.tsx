import { useEffect, useRef, useState } from "react"
import { User, Lock, ArrowRight, Mail, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

/* ─── WebGL smokey background ─── */

const vertexSrc = `
  attribute vec4 a_position;
  void main() { gl_Position = a_position; }
`

const fragmentSrc = `
precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec3 u_color;

void mainImage(out vec4 fragColor, in vec2 fragCoord){
  vec2 centeredUV = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);
  float time = iTime * 0.5;
  vec2 mouse = iMouse / iResolution;
  vec2 ripple = 2.0 * mouse - 1.0;
  vec2 d = centeredUV;
  for (float i = 1.0; i < 8.0; i++) {
    d.x += 0.5 / i * cos(i * 2.0 * d.y + time + ripple.x * 3.1415);
    d.y += 0.5 / i * cos(i * 2.0 * d.x + time + ripple.y * 3.1415);
  }
  float wave = abs(sin(d.x + d.y + time));
  float glow = smoothstep(0.9, 0.2, wave);
  fragColor = vec4(u_color * glow, 1.0);
}

void main() { mainImage(gl_FragColor, gl_FragCoord.xy); }
`

interface SmokeyBackgroundProps {
  color?: string
  className?: string
}

export function SmokeyBackground({ color = "#1E40AF", className = "" }: SmokeyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const hovering = useRef(false)

  const hexToRgb = (hex: string): [number, number, number] => [
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255,
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext("webgl")
    if (!gl) return

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }

    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertexSrc))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragmentSrc))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW)

    const pos = gl.getAttribLocation(prog, "a_position")
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, "iResolution")
    const uTime = gl.getUniformLocation(prog, "iTime")
    const uMouse = gl.getUniformLocation(prog, "iMouse")
    const uColor = gl.getUniformLocation(prog, "u_color")
    const [r, g, b] = hexToRgb(color)
    gl.uniform3f(uColor, r, g, b)

    const start = Date.now()
    let animId: number

    const render = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight
      canvas.width = w; canvas.height = h
      gl.viewport(0, 0, w, h)
      const t = (Date.now() - start) / 1000
      gl.uniform2f(uRes, w, h)
      gl.uniform1f(uTime, t)
      gl.uniform2f(uMouse,
        hovering.current ? mousePos.current.x : w / 2,
        hovering.current ? h - mousePos.current.y : h / 2
      )
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      animId = requestAnimationFrame(render)
    }

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mousePos.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    canvas.addEventListener("mousemove", onMove)
    canvas.addEventListener("mouseenter", () => { hovering.current = true })
    canvas.addEventListener("mouseleave", () => { hovering.current = false })
    render()

    return () => {
      cancelAnimationFrame(animId)
      canvas.removeEventListener("mousemove", onMove)
    }
  }, [color])

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute inset-0 backdrop-blur-sm" />
    </div>
  )
}

/* ─── Login / Register form ─── */

interface LoginFormProps {
  onSuccess: (isNew: boolean) => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const clear = () => setError("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError("Por favor completa todos los campos.")
      return
    }
    if (mode === "register" && !name.trim()) {
      setError("Ingresa tu nombre.")
      return
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    setLoading(true)
    setError("")

    const err =
      mode === "login"
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password, name.trim())

    setLoading(false)

    if (err) {
      // Translate common Supabase error messages
      if (err.includes("Invalid login credentials")) setError("Email o contraseña incorrectos.")
      else if (err.includes("User already registered")) setError("Este email ya está registrado. Inicia sesión.")
      else if (err.includes("Email not confirmed")) setError("Confirma tu email antes de ingresar.")
      else setError(err)
      return
    }

    onSuccess(mode === "register")
  }

  return (
    <div className="w-full max-w-sm p-8 space-y-5 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">
          {mode === "login" ? "Bienvenido" : "Crear cuenta"}
        </h2>
        <p className="mt-1.5 text-sm text-gray-300">
          {mode === "login"
            ? "Inicia sesión para acceder al curso"
            : "Regístrate para guardar tu progreso"}
        </p>
      </div>

      {/* Mode tabs */}
      <div className="flex rounded-xl bg-white/10 p-1 gap-1">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); clear() }}
            className={cn(
              "flex-1 py-1.5 rounded-lg text-sm font-medium transition",
              mode === m
                ? "bg-white text-neutral-900"
                : "text-white/70 hover:text-white"
            )}
          >
            {m === "login" ? "Iniciar sesión" : "Registrarse"}
          </button>
        ))}
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Name — only on register */}
        {mode === "register" && (
          <div className="relative z-0">
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); clear() }}
              className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
              placeholder=" "
              required
            />
            <label className="absolute text-sm text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              <User className="inline-block mr-2 -mt-1" size={16} />
              Nombre completo
            </label>
          </div>
        )}

        {/* Email */}
        <div className="relative z-0">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clear() }}
            className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder=" "
            required
          />
          <label className="absolute text-sm text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            <Mail className="inline-block mr-2 -mt-1" size={16} />
            Correo electrónico
          </label>
        </div>

        {/* Password */}
        <div className="relative z-0">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); clear() }}
            className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder=" "
            required
          />
          <label className="absolute text-sm text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            <Lock className="inline-block mr-2 -mt-1" size={16} />
            Contraseña {mode === "register" && "(mín. 6 caracteres)"}
          </label>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 rounded-lg px-3 py-2">
            <AlertCircle size={14} className="shrink-0" />
            {error}
          </div>
        )}

        {mode === "login" && (
          <div className="flex justify-end">
            <a href="#" className="text-xs text-gray-300 hover:text-white transition">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="group w-full flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg text-white font-semibold focus:outline-none transition-all duration-300"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              {mode === "login" ? "Ingresar" : "Crear cuenta"}
              <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-gray-400/30" />
          <span className="flex-shrink mx-4 text-gray-400 text-xs">O CONTINÚA CON</span>
          <div className="flex-grow border-t border-gray-400/30" />
        </div>

        <button
          type="button"
          disabled={loading}
          className="w-full flex items-center justify-center py-2.5 px-4 bg-white/90 hover:bg-white rounded-lg text-gray-700 font-semibold transition-all duration-300 disabled:opacity-60"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.841C34.553 4.806 29.613 2.5 24 2.5C11.983 2.5 2.5 11.983 2.5 24s9.483 21.5 21.5 21.5S45.5 36.017 45.5 24c0-1.538-.135-3.022-.389-4.417z"/>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12.5 24 12.5c3.059 0 5.842 1.154 7.961 3.039l5.839-5.841C34.553 4.806 29.613 2.5 24 2.5C16.318 2.5 9.642 6.723 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 45.5c5.613 0 10.553-2.306 14.802-6.341l-5.839-5.841C30.842 35.846 27.059 38 24 38c-5.039 0-9.345-2.608-11.124-6.481l-6.571 4.819C9.642 41.277 16.318 45.5 24 45.5z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l5.839 5.841C44.196 35.123 45.5 29.837 45.5 24c0-1.538-.135-3.022-.389-4.417z"/>
          </svg>
          Continuar con Google
        </button>
      </form>
    </div>
  )
}
