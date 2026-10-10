import photo from './assets/IMG_2883.png'

export const profile = {
  name: 'Mario López',
  role: 'Desarrollador Full Stack',
  tagline: 'Construyo aplicaciones web con React y Node.js, con código limpio y una interfaz cuidada.',
  email: 'ml.delarosa@outlook.es',
  github: 'mariopxz',
  linkedin: 'https://www.linkedin.com/in/mariopxz/',
  about:
    'Soy desarrollador full stack de Terrassa. Construyo aplicaciones web con React, Node.js y MySQL, y me gusta que funcionen bien y se vean mejor.',
  photo: photo,
}

export const since = 2023 // primer repo en GitHub y arranque de DAW

// Cada tecnología usa public/logos/<logo>.svg; los logos negros van en monoLogos para invertirlos en modo oscuro
export const monoLogos = ['github', 'vercel', 'express', 'railway', 'resend']
export const skills: Record<string, [name: string, logo: string][]> = {
  Lenguajes: [['JavaScript', 'javascript'], ['TypeScript', 'typescript'], ['PHP', 'php'], ['HTML', 'html5'], ['CSS', 'css3'], ['SCSS', 'sass']],
  Frameworks: [['React', 'react'], ['Node.js', 'nodejs'], ['Express.js', 'express'], ['Tailwind CSS', 'tailwindcss'], ['Bootstrap', 'bootstrap'], ['Vite', 'vitejs']],
  'Bases de datos': [['MySQL', 'mysql'], ['PostgreSQL', 'postgresql']],
  'Cloud y DevOps': [['Git', 'git'], ['GitHub', 'github'], ['Vercel', 'vercel'], ['Railway', 'railway'], ['Supabase', 'supabase'], ['Resend', 'resend']],
}

export const experience = [
  {
    company: 'Hörmann España',
    role: 'Técnico de Service',
    period: '07/2025 – 06/2026',
    place: 'Terrassa',
    points: ['Diagnóstico y resolución de incidencias técnicas en puertas industriales.', 'Montaje y mantenimiento de equipos en las instalaciones de los clientes.'],
    stack: [],
  },
  {
    company: 'Mira Telecomunicaciones',
    role: 'Desarrollador Full Stack',
    period: '09/2024 – 06/2025',
    place: 'Sant Cugat',
    points: [
      'Desarrollo de una nueva plataforma para clientes con React, Node.js y MySQL.',
      'Mejora de la experiencia de usuario de la web corporativa con HTML, CSS, JavaScript y PHP.',
      'Creación de una herramienta que automatiza el proceso de reservas y reduce tareas manuales del equipo.',
    ],
    stack: ['React', 'Node.js', 'MySQL', 'PHP', 'JavaScript'],
  },
]

export const education = [
  { school: "IES L'Estatut", title: 'Grado Superior en Desarrollo de Aplicaciones Web', period: '2023 – 2025', place: 'Rubí' },
  { school: 'IES Terrassa', title: 'Grado Superior de Mantenimiento Electrónico', period: '2021 – 2023', place: 'Terrassa' },
  { school: 'IES Terrassa', title: 'Grado Medio de Telecomunicaciones', period: '2018 – 2020', place: 'Terrassa' },
]

export const languages = [
  ['Español', 'Nativo'],
  ['Catalán', 'Nativo'],
  ['Inglés', 'Medio'],
]

export const softSkills = ['Trabajo en equipo', 'Resolución de problemas', 'Pensamiento analítico', 'Aprendizaje continuo']

export const projects: { title: string; kind: string; year: string; tag: string; desc: string; stack: string[]; image: string; code?: string; demo?: string }[] = [
  {
    title: 'Mochi',
    kind: 'Producto',
    year: '2026',
    tag: 'Tu espacio en internet',
    desc: 'Plataforma tipo «link in bio» personalizable que centraliza todos tus enlaces personales o profesionales en una sola página.',
    stack: ['React', 'Tailwind CSS', 'Vite', 'Node.js', 'Express', 'MySQL'],
    image: '/work/mochi.png',
    code: 'https://github.com/mariopxz/mochi',
    demo: 'https://mochiapp.es',
  },
  {
    title: 'Passy',
    kind: 'Herramienta',
    year: '2026',
    tag: 'Generador de contraseñas seguras',
    desc: 'Aplicación web responsive para generar contraseñas seguras, con longitud y complejidad personalizables.',
    stack: ['React', 'Tailwind CSS', 'TypeScript', 'Vite'],
    image: '/work/passy.png',
    code: 'https://github.com/mariopxz/passy',
    demo: 'https://passy-one.vercel.app/',
  },
  {
    title: 'Gesper Theme',
    kind: 'Tema VS Code',
    year: '2023',
    tag: 'Vesper con algo más de color',
    desc: 'Tema para Visual Studio Code basado en Vesper de raunofreiberg, con más color y algo más de estilo.',
    stack: ['VS Code', 'JSON'],
    image: '/work/gesper.svg',
    code: 'https://github.com/mariopxz/gesper-theme',
  },
]

export const aboutNotes = [
  "Titulado en Desarrollo de Aplicaciones Web por el IES L'Estatut, con una base previa en electrónica y telecomunicaciones.",
  'Como desarrollador full stack en Mira Telecomunicaciones mejoré la experiencia de usuario de la web corporativa con HTML, CSS, JavaScript y PHP, y desarrollé una herramienta que automatiza el proceso de reservas y reduce tareas manuales del equipo.',
  'Me gusta construir cosas pequeñas y bien acabadas, como Mochi o Passy, y aprender algo nuevo con cada una.',
]
