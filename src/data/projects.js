/**
 * 📁 ESTRUCTURA DE PROYECTOS
 * 
 * En este archivo puedes gestionar todos los proyectos que se muestran en el portfolio.
 * 
 * CAMPOS DISPONIBLES:
 * - id: Identificador único (número).
 * - title: Nombre del proyecto (aparece en la Card y en el overlay).
 * - category: Tipo de proyecto (ej. Web · Gastronomía, App Móvil, Branding).
 * - year: Año de realización.
 * - description: Una descripción corta que cautive al usuario (se muestra al abrir el proyecto).
 * - url: El link hacia el proyecto en vivo o repositorio.
 * - image: La ruta de la imagen. Puedes usar:
 *    a) Cargar una imagen local en: src/assets/images/tu-proyecto.jpg
 *       y luego importarla arriba: import imgProyecto from '../assets/images/tu-proyecto.jpg';
 *    b) Usar una URL externa directa (como se muestra abajo).
 */

import imgPizzaAura from '../assets/images/aurapizza.png';
import imgWebsiteGym from '../assets/images/gym.png';
import imgHubbica from '../assets/images/hubbica.png';
import imgAntojitos from '../assets/images/antojitos.png';
import imgOficlic from '../assets/images/oficlic.png';
import imgSkin from '../assets/images/skin.png';

export const projects = [
    {
        id: 1,
        title: 'Aura Pizza',
        category: 'GASTRONOMÍA · PREMIUM WEB',
        year: '2026',
        description: 'Una experiencia digital inmersiva para una pizzería de autor. Enfoque en tipografía elegante y transiciones fluidas.',
        url: 'https://pizzaaura.vercel.app/',
        image: imgPizzaAura,
    },
    {
        id: 2,
        title: 'The Fit Club',
        category: 'FITNESS · ACTIVE WEB',
        year: '2026',
        description: 'Plataforma de entrenamiento de alto rendimiento. Diseño dinámico con enfoque en la energía del movimiento y la conversión.',
        url: 'https://rodryvz.github.io/Website_Gym/',
        image: imgWebsiteGym,
    },
    {
        id: 3,
        title: 'Hubbica',
        category: 'COWORKING · SHARED SPACES',
        year: '2026',
        description: 'Plataforma para la gestión y reserva de espacios de trabajo colaborativos. Interfaz limpia y funcional orientada a la productividad.',
        url: 'https://hubbica.vercel.app/',
        image: imgHubbica,
    },
    {
        id: 4,
        title: 'Antojitos',
        category: 'SWEETS · BAKERY WEB',
        year: '2026',
        description: 'E-commerce artesanal de pastelería personalizada. Diseño suave y acogedor que invita a explorar momentos dulces.',
        url: 'https://antojitoweb.netlify.app/',
        image: imgAntojitos,
    },
    {
        id: 5,
        title: 'Oficlic',
        category: 'SERVICES · PROFESSIONAL CONNECT',
        year: '2026',
        description: 'Directorio inteligente que conecta problemas con profesionales expertos. Enfoque directo, confiable y de alta usabilidad.',
        url: 'https://officlic-header-react-magic.vercel.app/',
        image: imgOficlic,
    },
    {
        id: 6,
        title: 'Skin Care',
        category: 'BEAUTY · E-COMMERCE',
        year: '2026',
        description: 'Plataforma ecommerce elegante y minimalista para productos de cuidado de la piel. Diseño moderno y sofisticado.',
        url: 'https://softcare-skin.netlify.app/',
        image: imgSkin,
    },
];
