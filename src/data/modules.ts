import {
  Map,
  BookOpen,
  TrendingDown,
  Fingerprint,
  FileCheck2,
  Ship,
  ShieldAlert,
  Scale,
  Landmark,
  Users,
  Flag,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

export interface CourseModule {
  id: number
  numero: number
  titulo: string
  subtitulo: string
  descripcion: string
  video: string
  ppt: string | null
  icono: LucideIcon
  gradiente: [string, string]
  imagen: string
}

// Rutas relativas a /assets, servidas desde public/assets vía junctions
// hacia las carpetas originales del curso (ver web/public/assets).
const VIDEOS = "/assets/videos/"
const PPT = "/assets/ppt/"
export const DOC_URL = `/assets/docs/${encodeURIComponent(
  "Curso DR-CAFTA - Documentación completa.docx"
)}`

function v(name: string) {
  return VIDEOS + encodeURIComponent(name)
}
function p(name: string) {
  return PPT + encodeURIComponent(name)
}

const IMAGES = "/images/modules/"

// Paleta fija que rota entre módulos, para consistencia visual sin depender
// de imágenes.
const PALETTE: [string, string][] = [
  ["#7f1d1d", "#1c1917"],
  ["#78350f", "#1c1917"],
  ["#14532d", "#1c1917"],
  ["#1e3a8a", "#1c1917"],
  ["#581c87", "#1c1917"],
  ["#831843", "#1c1917"],
]

export const modules: CourseModule[] = [
  {
    id: 0,
    numero: 0,
    titulo: "Anatomía de un tratado",
    subtitulo: "Cómo leer el DR-CAFTA",
    descripcion:
      "Identifica los componentes de un tratado y su jerarquía, entiende cómo un anexo modifica el texto principal, y aplica un método de consulta de 6 pasos para responder cualquier pregunta comercial.",
    video: v("Anatomía_del_DR-CAFTA-modulo-0.mp4"),
    ppt: p("Módulo 0 - DR-CAFTA - Anatomía de un tratado.pptx"),
    icono: Map,
    gradiente: PALETTE[0],
    imagen: IMAGES + "modulo-0.png",
  },
  {
    id: 1,
    numero: 1,
    titulo: "Disposiciones y Definiciones",
    subtitulo: "Capítulos 1 y 2",
    descripcion:
      "Domina el sistema de definiciones del tratado: cómo localizar una definición, distinguir las generales de las específicas por capítulo, y detectar cuándo una definición vive en un anexo.",
    video: v("DR-CAFTA__Capítulos_1_y_2(_Modulo-1).mp4"),
    ppt: p("Módulo 1 - DR-CAFTA - Disposiciones y Definiciones.pptx"),
    icono: BookOpen,
    gradiente: PALETTE[1],
    imagen: IMAGES + "modulo-1.png",
  },
  {
    id: 2,
    numero: 2,
    titulo: "Acceso a mercados y desgravación",
    subtitulo: "Capítulo 3",
    descripcion:
      "Toma un producto, búscalo en la lista de desgravación de un país y determina el arancel preferencial que le aplica hoy bajo el DR-CAFTA.",
    video: v("El_espejismo_del_cero(_Modulo-2).mp4"),
    ppt: p("Módulo 2 - DR-CAFTA - Acceso a mercados y desgravación.pptx"),
    icono: TrendingDown,
    gradiente: PALETTE[2],
    imagen: IMAGES + "modulo-2.jpg",
  },
  {
    id: 3,
    numero: 3,
    titulo: "Reglas de Origen",
    subtitulo: "El corazón del tratado — Capítulo 4",
    descripcion:
      "El núcleo técnico del tratado: determina si un producto califica como \"originario\", aplicando el criterio correcto y leyendo la regla específica de su partida HS.",
    video: v("DR-CAFTA__Reglas_de_Origen(Mudulo-3).mp4"),
    ppt: p("Módulo 3 - DR-CAFTA - Reglas de origen.pptx"),
    icono: Fingerprint,
    gradiente: PALETTE[3],
    imagen: IMAGES + "modulo-3.png",
  },
  {
    id: 4,
    numero: 4,
    titulo: "Certificación y verificación de origen",
    subtitulo: "Procedimientos — Capítulo 4",
    descripcion:
      "Cómo certificar correctamente el origen de una mercancía, qué información exige el tratado, qué obligaciones asume cada actor y cómo defender una verificación de origen ante la aduana.",
    video: v("itulo4( Modulo-4).mp4"),
    ppt: p("Módulo 4 - DR-CAFTA - Certificación y verificación de origen.pptx"),
    icono: FileCheck2,
    gradiente: PALETTE[4],
    imagen: IMAGES + "modulo-4.jpg",
  },
  {
    id: 5,
    numero: 5,
    titulo: "Administración aduanera y facilitación",
    subtitulo: "Capítulo 5",
    descripcion:
      "Los compromisos que el DR-CAFTA impone a las aduanas: despacho ágil, transparencia, gestión de riesgo, envíos expresos y el derecho del importador a impugnar decisiones aduaneras.",
    video: v("DR-CAFTA__Facilitación(_Modulo-5).mp4"),
    ppt: p("Módulo 5 - DR-CAFTA - Administración aduanera y facilitación.pptx"),
    icono: Ship,
    gradiente: PALETTE[5],
    imagen: IMAGES + "modulo-5.png",
  },
  {
    id: 6,
    numero: 6,
    titulo: "Barreras no arancelarias",
    subtitulo: "MSF y OTC — Capítulos 6 y 7",
    descripcion:
      "Por qué un producto puede entrar \"libre\" según el tratado y aun así toparse con permisos, registros y requisitos técnicos: la base de la clasificación de dificultad de entrada.",
    video: v("Barreras_No_Arancelarias(_Modulo-6).mp4"),
    ppt: p("Módulo 6 - DR-CAFTA - Barreras no arancelarias (MSF y OTC).pptx"),
    icono: ShieldAlert,
    gradiente: PALETTE[0],
    imagen: IMAGES + "modulo-6.jpg",
  },
  {
    id: 7,
    numero: 7,
    titulo: "Defensa comercial, inversión y servicios",
    subtitulo: "Capítulos 8, 10-13",
    descripcion:
      "Cómo el tratado protege a la industria nacional, al inversionista extranjero y cómo abre el comercio de servicios — a qué capítulo ir ante cada situación.",
    video: v("DR-CAFTA__Módulo_7.mp4"),
    ppt: p("Módulo 7 - DR-CAFTA - Defensa comercial, inversión y servicios.pptx"),
    icono: Scale,
    gradiente: PALETTE[1],
    imagen: IMAGES + "modulo-7.jpg",
  },
  {
    id: 8,
    numero: 8,
    titulo: "Compras públicas, e-commerce y PI",
    subtitulo: "Capítulos 9, 14, 15",
    descripcion:
      "Cómo el tratado abre las compras del Estado, protege y facilita el comercio digital, y qué estándares de propiedad intelectual impone en la frontera.",
    video: v("Módulo_8_DR-CAFTA__Compras,_PI(Modulo-8).mp4"),
    ppt: p("Módulo 8 - DR-CAFTA - Compras públicas, e-commerce y PI.pptx"),
    icono: Landmark,
    gradiente: PALETTE[2],
    imagen: IMAGES + "modulo-8.jpg",
  },
  {
    id: 9,
    numero: 9,
    titulo: "Laboral, ambiental e institucionalidad",
    subtitulo: "Capítulos 16-22",
    descripcion:
      "Los compromisos laborales y ambientales, y cómo se administra, interpreta y hace cumplir el tratado: gobernanza, resolución de conflictos y excepciones.",
    video: v("Maquinaria_DR-CAFTA(Modulo-9).mp4"),
    ppt: p("Módulo 9 - DR-CAFTA - Laboral, ambiental e institucionalidad.pptx"),
    icono: Users,
    gradiente: PALETTE[3],
    imagen: IMAGES + "modulo-9.jpg",
  },
  {
    id: 10,
    numero: 10,
    titulo: "Aplicación en República Dominicana",
    subtitulo: "El aterrizaje operativo",
    descripcion:
      "Cómo se ejecuta el DR-CAFTA dentro de RD: leyes, instituciones, ventanillas, y la aplicación práctica de desgravación, origen, despacho y barreras no arancelarias.",
    video: v("DR-CAFTA_en_la_Práctica(_Modulo-10).mp4"),
    ppt: p("Módulo 10 - DR-CAFTA - Aplicación en República Dominicana.pptx"),
    icono: Flag,
    gradiente: PALETTE[4],
    imagen: IMAGES + "modulo-10.png",
  },
]

export const bonusModule: CourseModule = {
  id: 99,
  numero: 0,
  titulo: "DR-CAFTA: Comercio Real",
  subtitulo: "Resumen de todo el curso",
  descripcion:
    "Un recorrido resumido por los 11 módulos: cómo se lee, se estudia y se aplica el DR-CAFTA en el comercio real, de principio a fin.",
  video: v("DR-CAFTA__Comercio_Real(_V-de_todo_resumido_).mp4"),
  ppt: null,
  icono: Sparkles,
  gradiente: PALETTE[5],
  imagen: IMAGES + "hero.jpg",
}
