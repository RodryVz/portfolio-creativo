import { projects } from '../../data/projects';

export const QUICK_PROMPTS = [
  { id: 'about', label: '¿Quién es Rodrigo?', query: '¿Quién es Rodrigo Valenzuela y qué hace?' },
  { id: 'projects', label: 'Ver proyectos', query: '¿Cuáles son tus proyectos más destacados?' },
  { id: 'services', label: 'Servicios & disponibilidad', query: '¿Qué servicios ofreces y estás disponible?' },
  { id: 'stack', label: 'Stack tecnológico', query: '¿Qué tecnologías y herramientas dominas?' },
  { id: 'contact', label: 'Contacto & cotizaciones', query: '¿Cómo puedo contactarte o pedir presupuesto?' },
];

/**
 * Normaliza cadenas de texto para búsqueda libre de acentos y mayúsculas
 */
function normalizeText(str = '') {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Motor de respuestas del archivo interactivo
 */
export function getAssistantResponse(userQuery = '') {
  const q = normalizeText(userQuery);

  if (!q) {
    return {
      text: 'Por favor escribe una consulta o selecciona una de las preguntas sugeridas para explorar la información del archivo.',
      actions: [],
    };
  }

  // 1. Saludos
  if (['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'hello', 'hi', 'que tal'].some(g => q.startsWith(g) || q === g)) {
    return {
      text: '¡Hola! Bienvenido al archivo digital de **Rodrigo Valenzuela**. Soy su asistente interactivo. Puedo detallarte sus proyectos en producción, tecnologías, servicios freelance o conectarte directamente a través de su correo **Rodry_valenzuela@hotmail.com**. ¿En qué puedo ayudarte hoy?',
      suggestions: ['¿Quién es Rodrigo?', 'Ver proyectos', 'Servicios & disponibilidad', 'Contacto'],
      actions: [
        { label: 'VER PROYECTOS', query: 'proyectos' },
        { label: 'RODRY_VALENZUELA@HOTMAIL.COM ✉', url: 'mailto:Rodry_valenzuela@hotmail.com' },
        { label: 'COPIAR CORREO', copyText: 'Rodry_valenzuela@hotmail.com' }
      ]
    };
  }

  // 2. Proyectos específicos
  const foundProject = projects.find(p => {
    const titleNorm = normalizeText(p.title);
    return q.includes(titleNorm) || (titleNorm === 'skin care' && q.includes('skin'));
  });

  if (foundProject) {
    return {
      text: `**${foundProject.title}** (${foundProject.year || '2026'})\n\n` +
            `• **Categoría:** ${foundProject.category}\n` +
            `• **Detalle:** ${foundProject.description}\n` +
            `• **Estado:** ${foundProject.url ? 'En vivo y disponible para explorar.' : 'En desarrollo activo.'}`,
      actions: foundProject.url ? [
        { label: `VISITAR ${foundProject.title.toUpperCase()} ↗`, url: foundProject.url, external: true },
        { label: 'VER OTROS PROYECTOS', query: 'proyectos' }
      ] : [
        { label: 'VER OTROS PROYECTOS', query: 'proyectos' }
      ]
    };
  }

  // 3. Proyectos en general
  if (['proyecto', 'portfolio', 'trabajo', 'obras', 'casos', 'demos', 'web'].some(k => q.includes(k))) {
    const listText = projects.map((p, idx) => `**${idx + 1}. ${p.title}** — ${p.category}`).join('\n');
    return {
      text: `Rodrigo cuenta actualmente con **7 proyectos destacados** en este portfolio:\n\n${listText}\n\nPuedes hacer clic en el botón de abajo para explorar cualquiera de ellos o preguntarme por uno en específico (por ejemplo: *"Háblame de Veluno"* o *"Smile"*).`,
      actions: [
        { label: 'EXPLORAR VELUNO ↗', url: 'https://veluno-sigma.vercel.app/', external: true },
        { label: 'EXPLORAR AURA PIZZA ↗', url: 'https://aura-pizza.vercel.app/', external: true },
        { label: 'EXPLORAR SMILE ↗', url: 'https://smile-dnt.netlify.app/', external: true }
      ]
    };
  }

  // 4. ¿Quién es Rodrigo? / Bio / Experiencia
  if (['quien', 'rodrigo', 'sobre ti', 'about', 'perfil', 'experiencia', 'bio', 'valenzuela', 'historia'].some(k => q.includes(k))) {
    return {
      text: `**Rodrigo Valenzuela** es un **Creative Developer y Diseñador Web** radicado en Resistencia, Chaco (Argentina).\n\n` +
            `Se especializa en el desarrollo de **experiencias digitales de alta gama**, combinando diseño editorial vanguardista, micro-interacciones cinematográficas, shaders WebGL con distorsión líquida y arquitectura frontend ultra-optimizada a 60/120 FPS sostenidos.\n\n` +
            `Trabaja con marcas, estudios y clínicas internacionales transformando su identidad en experiencias interactivas memorables.`,
      actions: [
        { label: 'DESCARGAR CV (PDF) ↓', url: '/CV_Rodrigo_Valenzuela.pdf', download: true },
        { label: 'VER LINKEDIN ↗', url: 'https://www.linkedin.com/in/rodrigo-gabriel-valenzuela', external: true }
      ]
    };
  }

  // 5. Tecnologías / Stack
  if (['stack', 'tecnologia', 'lenguaje', 'herramienta', 'react', 'webgl', 'javascript', 'css', 'shader', 'codigo', 'skills', 'habilidades'].some(k => q.includes(k))) {
    return {
      text: `El stack principal de Rodrigo abarca tecnologías modernas de alto rendimiento:\n\n` +
            `• **Frontend Core:** React 19, JavaScript ESNext, TypeScript.\n` +
            `• **Gráficos & 3D:** WebGL, OGL, GLSL Shaders, HTML5 Canvas interactivo.\n` +
            `• **Físicas & Animación:** Framer Motion, Springs, interpolación lerp personalizada.\n` +
            `• **Estilos & UI:** Tailwind CSS, CSS Grid/Flexbox moderno, estética Brutalista & Editorial.\n` +
            `• **Rendimiento:** Cero presión de Garbage Collector, DPR dinámico para pantallas Retina y optimización Awwwards / FWA.`,
      actions: [
        { label: 'VER GITHUB REPOSITORIOS ↗', url: 'https://github.com/RodryVz', external: true }
      ]
    };
  }

  // 6. Servicios / Freelance / Disponibilidad
  if (['servicio', 'ofreces', 'disponib', 'freelance', 'trabajar', 'contratar', 'remoto', 'modalidad'].some(k => q.includes(k))) {
    return {
      text: `**Disponibilidad Actual:** ✅ **Abierto para proyectos freelance y colaboraciones 2026**.\n\n` +
            `**Servicios especializados:**\n` +
            `1. **Desarrollo Web Creativo:** Sitios web únicos con animaciones y transiciones de alto impacto.\n` +
            `2. **Rediseño & Identidad Digital:** Creación de plataformas para marcas boutique, estudios y clínicas.\n` +
            `3. **Auditoría de Rendimiento:** Optimización extrema de velocidad, interactividad y Core Web Vitals.\n` +
            `4. **Modalidad:** 100% Remoto a nivel internacional, con comunicación fluida en español e inglés.\n\n` +
            `📩 **Contacto directo:** Rodry_valenzuela@hotmail.com`,
      actions: [
        { label: 'SOLICITAR DISPONIBILIDAD ✉', url: 'mailto:Rodry_valenzuela@hotmail.com?subject=Consulta%20de%20Proyecto%202026' },
        { label: 'COPIAR CORREO', copyText: 'Rodry_valenzuela@hotmail.com' }
      ]
    };
  }

  // 7. Tarifas / Presupuesto / Precios
  if (['precio', 'tarifa', 'cuanto cuesta', 'costo', 'presupuesto', 'cotizar', 'valores', 'cobras'].some(k => q.includes(k))) {
    return {
      text: `Las tarifas se adaptan a la escala y requerimientos específicos de cada proyecto (complejidad visual, shaders interactivos, cantidad de secciones y plazos de entrega).\n\n` +
            `Para brindarte una cotización estimada precisa y sin compromiso, escribe directamente a **Rodry_valenzuela@hotmail.com** con una breve descripción de tu idea.`,
      actions: [
        { label: 'PEDIR COTIZACIÓN VÍA EMAIL ✉', url: 'mailto:Rodry_valenzuela@hotmail.com?subject=Solicitud%20de%20Presupuesto' },
        { label: 'COPIAR EMAIL', copyText: 'Rodry_valenzuela@hotmail.com' }
      ]
    };
  }

  // 8. Contacto / Enlaces
  if (['contacto', 'contactar', 'email', 'correo', 'mail', 'whatsapp', 'linkedin', 'github', 'redes', 'hablar'].some(k => q.includes(k))) {
    return {
      text: `Puedes comunicarte con Rodrigo directamente a través de cualquiera de sus canales oficiales:\n\n` +
            `• **Email:** Rodry_valenzuela@hotmail.com\n` +
            `• **LinkedIn:** linkedin.com/in/rodrigo-gabriel-valenzuela\n` +
            `• **GitHub:** github.com/RodryVz\n` +
            `• **Ubicación:** Resistencia, Chaco, Argentina (GMT-3)`,
      actions: [
        { label: 'RODRY_VALENZUELA@HOTMAIL.COM ✉', url: 'mailto:Rodry_valenzuela@hotmail.com' },
        { label: 'COPIAR CORREO', copyText: 'Rodry_valenzuela@hotmail.com' },
        { label: 'VER PERFIL DE LINKEDIN ↗', url: 'https://www.linkedin.com/in/rodrigo-gabriel-valenzuela', external: true }
      ]
    };
  }

  // Fallback inteligente
  return {
    text: `No encontré una coincidencia exacta para *"${userQuery}"*, pero puedes escribirme directamente a **Rodry_valenzuela@hotmail.com** o explorar los temas principales del archivo:`,
    suggestions: ['¿Quién es Rodrigo?', 'Ver proyectos', 'Servicios & disponibilidad', 'Contacto & cotizaciones'],
    actions: [
      { label: 'VER PROYECTOS DESTACADOS', query: 'proyectos' },
      { label: 'RODRY_VALENZUELA@HOTMAIL.COM ✉', url: 'mailto:Rodry_valenzuela@hotmail.com' },
      { label: 'COPIAR CORREO', copyText: 'Rodry_valenzuela@hotmail.com' }
    ]
  };
}
