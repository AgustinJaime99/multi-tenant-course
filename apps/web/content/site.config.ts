/**
 * Configuración WHITE-LABEL.
 * Cambia estos valores para re-marcar la plataforma para otro cliente/nicho.
 * No hace falta tocar el código de la app: branding, textos, colores base,
 * enlaces y secciones de la landing se controlan desde aquí.
 */
export interface SiteConfig {
  brand: {
    name: string;
    shortName: string;
    tagline: string;
    logoEmoji: string;
    primaryColor: string; // clase tailwind base, p.ej. "brand"
    contactEmail: string;
  };
  hero: {
    badge: string;
    title: string;
    highlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    imageUrl: string;
  };
  stats: { label: string; value: string }[];
  features: { icon: string; title: string; description: string }[];
  benefits: string[];
  testimonials: { name: string; role: string; quote: string }[];
  faq: { question: string; answer: string }[];
  footer: {
    description: string;
    columns: { title: string; links: { label: string; href: string }[] }[];
  };
}

export const siteConfig: SiteConfig = {
  brand: {
    name: "Barber Academy Pro",
    shortName: "BarberPro",
    tagline: "Conviértete en un barbero de élite",
    logoEmoji: "💈",
    primaryColor: "brand",
    contactEmail: "hola@barberacademy.pro",
  },
  hero: {
    badge: "Curso #1 de barbería online",
    title: "Domina el arte de la",
    highlight: "barbería profesional",
    subtitle:
      "Aprende cortes, fades, diseño de barba y cómo construir tu propio negocio con clases prácticas paso a paso, desde cero hasta nivel experto.",
    ctaPrimary: "Empezar ahora",
    ctaSecondary: "Ver el curso",
    imageUrl:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80",
  },
  stats: [
    { label: "Alumnos formados", value: "+3.500" },
    { label: "Horas de contenido", value: "40h" },
    { label: "Valoración media", value: "4.9/5" },
    { label: "Certificación", value: "Incluida" },
  ],
  features: [
    {
      icon: "Scissors",
      title: "Técnicas profesionales",
      description: "Fades, degradados, tijera y navaja explicados con detalle en video HD.",
    },
    {
      icon: "PlayCircle",
      title: "Aprende a tu ritmo",
      description: "Acceso de por vida con progreso guardado lección a lección.",
    },
    {
      icon: "Award",
      title: "Certificado oficial",
      description: "Obtén tu certificado descargable al completar el curso.",
    },
    {
      icon: "Briefcase",
      title: "Monta tu negocio",
      description: "Estrategias de marca, precios y fidelización de clientes.",
    },
    {
      icon: "MessageSquare",
      title: "Soporte directo",
      description: "Resuelve tus dudas con nuestro sistema de tickets de soporte.",
    },
    {
      icon: "CreditCard",
      title: "Pago flexible",
      description: "Paga con tarjeta, Mercado Pago o cripto vía Binance Pay.",
    },
  ],
  benefits: [
    "Acceso inmediato y de por vida",
    "Contenido descargable y actualizado",
    "Certificado de finalización",
    "Comunidad y soporte personalizado",
  ],
  testimonials: [
    {
      name: "Carlos Méndez",
      role: "Barbero en CDMX",
      quote: "Pasé de cortar en casa a abrir mi propia barbería en 6 meses. El módulo de negocio es oro.",
    },
    {
      name: "Andrés Rivas",
      role: "Estudiante",
      quote: "Las explicaciones de los fades son las mejores que he visto. Muy claro y práctico.",
    },
    {
      name: "Diego Torres",
      role: "Emprendedor",
      quote: "El certificado me ayudó a conseguir trabajo en una barbería top de mi ciudad.",
    },
  ],
  faq: [
    {
      question: "¿Necesito experiencia previa?",
      answer: "No. El curso empieza desde lo más básico y avanza progresivamente hasta nivel experto.",
    },
    {
      question: "¿El acceso es de por vida?",
      answer: "Sí, una vez compras el curso tienes acceso permanente a todo el contenido y sus actualizaciones.",
    },
    {
      question: "¿Obtengo un certificado?",
      answer: "Sí, al completar el 100% de las lecciones podrás descargar tu certificado en PDF.",
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer: "Tarjeta (Stripe), Mercado Pago y criptomonedas mediante Binance Pay.",
    },
  ],
  footer: {
    description: "La academia online para convertirte en barbero profesional y emprender en el sector.",
    columns: [
      {
        title: "Plataforma",
        links: [
          { label: "Cursos", href: "/#cursos" },
          { label: "Iniciar sesión", href: "/login" },
          { label: "Registrarse", href: "/register" },
        ],
      },
      {
        title: "Soporte",
        links: [
          { label: "Centro de ayuda", href: "/dashboard/support" },
          { label: "Preguntas frecuentes", href: "/#faq" },
        ],
      },
    ],
  },
};
