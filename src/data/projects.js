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
 * - url: El link hacia el proyecto en vivo o repositorio (dejar '' si aún no está online).
 * - image: La ruta de la imagen local importada.
 */

import imgPizzaAura from '../assets/images/aurapizza.png';
import imgWebsiteGym from '../assets/images/website-gym.jpg';
import imgVeluno from '../assets/images/veluno.png';
import imgSmile from '../assets/images/smile.png';
import imgTerranova from '../assets/images/terranova.png';
import imgSkin from '../assets/images/skin.png';
import imgDental from '../assets/images/dental.png';

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
        title: 'Veluno',
        category: 'CREATIVE STUDIO · DIGITAL DESIGN',
        year: '2026',
        description: 'Identidad visual y experiencia interactiva moderna. Enfoque en diseño vanguardista, equilibrio espacial y transiciones elegantes.',
        url: 'https://veluno-sigma.vercel.app/', 
        image: imgVeluno,
    },
    {
        id: 4,
        title: 'Smile',
        category: 'HEALTH & BEAUTY · STUDIO',
        year: '2026',
        description: 'Plataforma integral enfocada en salud y estética dental. Experiencia visual limpia, luminosa y altamente intuitiva.',
        url: 'https://smile-dnt.netlify.app/', 
        image: imgSmile,
    },
    {
        id: 5,
        title: 'Terranova',
        category: 'ARCHITECTURE · REAL ESTATE',
        year: '2026',
        description: 'Espacio digital para desarrollos y proyectos arquitectónicos. Composición estructurada, sobria y de alto impacto visual.',
        url: 'https://terranova-clinic.vercel.app/', 
        image: imgTerranova,
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
    {
        id: 7,
        title: 'Clinica Dental',
        category: 'HEALTH · DENTAL',
        year: '2026',
        description: 'Sitio web profesional para una clínica dental. Diseño limpio, confiable y centrado en la experiencia del paciente.',
        url: 'https://dentalhealth-mocha.vercel.app/',
        image: imgDental,
    },
];
