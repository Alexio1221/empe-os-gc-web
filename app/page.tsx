"use client"

import { useState, useEffect } from "react"
import {
  Laptop, Wrench, Tv, Smartphone, Gamepad2, WashingMachine,
  Camera, Music, ShieldCheck, Clock, TrendingUp, Lock,
  Phone, MapPin, Mail, Menu, X, ChevronDown, ArrowRight,
  MessageCircle, Star, Check,
} from "lucide-react"

// ─── DATA ────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Servicios",      href: "#servicios" },
  { label: "Cómo funciona",  href: "#proceso" },
  { label: "Nosotros",       href: "#nosotros" },
  { label: "FAQ",            href: "#faq" },
  { label: "Contacto",       href: "#contacto" },
]

const SERVICIOS = [
  { icon: Smartphone,     label: "Celulares",         desc: "iPhone, Samsung, Xiaomi y más marcas." },
  { icon: Laptop,         label: "Laptops",           desc: "Cualquier marca y modelo en buen estado." },
  { icon: Gamepad2,       label: "Consolas",          desc: "PS5, Xbox, Nintendo Switch y anteriores." },
  { icon: Tv,             label: "Televisores",       desc: "Smart TVs y monitores de todas las pulgadas." },
  { icon: Wrench,         label: "Herramientas",      desc: "Taladros, amoladoras, compresores y más." },
  { icon: WashingMachine, label: "Electrodomésticos", desc: "Lavadoras, refrigeradoras, microondas." },
  { icon: Camera,         label: "Cámaras",           desc: "Réflex, mirrorless, drones y accesorios." },
  { icon: Music,          label: "Instrumentos",      desc: "Guitarras, teclados y equipos de audio." },
]

const PASOS = [
  { n: "01", titulo: "Trae tu artículo",   desc: "Sin cita previa. Visítanos con el objeto que deseas empeñar o vender." },
  { n: "02", titulo: "Tasación gratuita",  desc: "Nuestros expertos evalúan tu artículo en minutos, sin compromiso." },
  { n: "03", titulo: "Recibe una oferta",  desc: "Te presentamos una oferta clara y transparente, sin letras pequeñas." },
  { n: "04", titulo: "Dinero inmediato",   desc: "Acepta y recibe efectivo en mano al instante. Así de simple." },
]

const STATS = [
  { valor: "15+",   label: "Años de experiencia" },
  { valor: "12k+",  label: "Clientes atendidos" },
  { valor: "15min", label: "Para tener tu dinero" },
  { valor: "98%",   label: "Clientes satisfechos" },
]

const TESTIMONIOS = [
  { inicial: "M", nombre: "Miguel A.", ciudad: "Cochabamba", texto: "Necesitaba dinero urgente y en 20 minutos tenía el préstamo en mano. Trato excelente y sin complicaciones.", estrellas: 5 },
  { inicial: "S", nombre: "Sandra R.", ciudad: "Quillacollo", texto: "Vendí mi laptop vieja y me dieron un precio muy justo. Todo con claridad, sin presiones. Volvería sin dudar.", estrellas: 5 },
  { inicial: "J", nombre: "Jorge P.", ciudad: "Sacaba",      texto: "Llevo dos años usando sus servicios cuando necesito liquidez rápida. Siempre transparencia y buen trato.", estrellas: 5 },
  { inicial: "C", nombre: "Carmen V.", ciudad: "Cochabamba", texto: "Fui con mis herramientas de trabajo y la oferta fue justa y rápida. El personal muy amable.", estrellas: 5 },
]

const FAQS = [
  { p: "¿Qué artículos puedo empeñar?",                    r: "Aceptamos electrónica, herramientas, electrodomésticos, instrumentos musicales, cámaras y más. Si tienes dudas sobre un artículo puntual, consúltanos y te orientamos." },
  { p: "¿Cuánto tiempo tengo para recuperar mi artículo?",  r: "El plazo estándar es 30 días, renovable pagando solo los intereses. Trabajamos con flexibilidad para adaptarnos a tu situación." },
  { p: "¿Cómo se calcula el monto del préstamo?",           r: "Basamos el monto en el valor de mercado actual del artículo y su estado de conservación. Nuestros tasadores garantizan la mejor valoración posible." },
  { p: "¿Mis datos son confidenciales?",                    r: "Absolutamente. Toda la información que nos proporcionas se maneja con total discreción y confidencialidad." },
  { p: "¿Qué pasa si no puedo recuperar mi artículo?",      r: "Puedes renovar el plazo pagando los intereses. Si no puedes recuperarlo, el artículo cubre el préstamo. Sin deudas adicionales ni cobros extra." },
  { p: "¿Qué documentos necesito?",                         r: "Solo tu documento de identidad vigente (CI o pasaporte). Sin papeleo complicado ni trámites adicionales." },
]

const CONTACTO = {
  telefono:  "+591 4 456-7890",
  whatsapp:  "59175140189",
  email:     "info@empenosgc.bo",
  direccion: "Av. Heroínas #890, entre Jordán y 25 de Mayo",
  ciudad:    "Cochabamba, Bolivia",
  horarios: [
    { dia: "Lunes – Viernes", hora: "8:00 – 19:00" },
    { dia: "Sábado",          hora: "9:00 – 17:00" },
    { dia: "Domingo",         hora: "Cerrado" },
  ],
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const scrollTo = (href: string) => {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-slate-950/95 backdrop-blur-md shadow-sm border-b border-white/10" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-amber-500 rounded-md flex items-center justify-center font-bold text-white text-sm group-hover:bg-amber-400 transition-colors">GC</div>
            <span className="font-bold text-white text-lg tracking-wide">Empeños GC</span>
          </a>

          <nav className="hidden md:flex gap-6">
            {NAV_LINKS.map(l => (
              <button key={l.href} onClick={() => scrollTo(l.href)} className="text-white/75 hover:text-amber-400 text-sm font-medium transition-colors">
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a href={`https://wa.me/${CONTACTO.whatsapp}`} target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm px-4 py-2 rounded-md transition-colors">
              <MessageCircle size={16} /> WhatsApp
            </a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white p-1">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 bg-slate-950 pt-20 px-6 flex flex-col transition-transform duration-300 md:hidden ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
        {NAV_LINKS.map(l => (
          <button key={l.href} onClick={() => { scrollTo(l.href); setMenuOpen(false) }} className="text-left text-white/80 font-bold text-xl py-4 border-b border-white/10">
            {l.label}
          </button>
        ))}
        <a href={`https://wa.me/${CONTACTO.whatsapp}`} className="mt-6 flex items-center justify-center gap-2 bg-amber-600 text-white font-semibold py-3 rounded-lg">
          <MessageCircle size={18} /> Escribir por WhatsApp
        </a>
      </div>
    </>
  )
}

const Hero = () => (
  <section className="relative min-h-screen bg-slate-950 flex items-center overflow-hidden pt-20">
    {/* Decoración de fondo */}
    <div className="absolute inset-0 opacity-5 bg-[linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] bg-[size:64px_64px]" />
    <div className="absolute -top-[10%] -right-[5%] w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
    <div className="absolute -bottom-[15%] -left-[5%] w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />

    <div className="max-w-7xl mx-auto px-6 py-20 w-full relative z-10">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Préstamos inmediatos · Cochabamba
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-6">
          Dinero inmediato <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">por tus artículos.</span>
        </h1>

        <p className="text-lg text-white/60 mb-10 max-w-xl leading-relaxed">
          Empeña celulares, laptops, herramientas, electrodomésticos y más. Evaluación justa, proceso transparente y efectivo en 15 minutos.
        </p>

        <div className="flex flex-wrap gap-4 mb-14">
          <button onClick={() => scrollTo("#proceso")} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Cómo funciona <ArrowRight size={18} />
          </button>
          <a href={`https://wa.me/${CONTACTO.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 border-2 border-white/20 hover:border-white/60 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            <MessageCircle size={18} /> Consultar por WhatsApp
          </a>
        </div>

        <div className="flex flex-wrap gap-6">
          {[
            { icon: ShieldCheck, label: "100% Confidencial" },
            { icon: Clock, label: "Dinero en 15 min" },
            { icon: Star, label: "+12.000 clientes" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Icon size={16} className="text-amber-500" />
              </div>
              <span className="text-sm text-white/60">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    
    {/* SVG Divider Bottom */}
    <div className="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 72" className="w-full h-12 md:h-16 fill-slate-50" preserveAspectRatio="none">
        <polygon points="0,72 1440,0 1440,72" />
      </svg>
    </div>
  </section>
)

const Stats = () => (
  <section className="bg-slate-950 py-12 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
      {STATS.map(s => (
        <div key={s.label} className="text-center">
          <p className="font-black text-4xl md:text-5xl text-white mb-2">{s.valor}</p>
          <p className="text-xs text-white/50 tracking-wider uppercase">{s.label}</p>
        </div>
      ))}
    </div>
  </section>
)

const Servicios = () => (
  <section id="servicios" className="py-24 px-6 bg-slate-50">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-3">¿Qué puedes empeñar?</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4">Artículos que aceptamos</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">Nos especializamos en electrónica, herramientas y equipos del hogar. No en joyas.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SERVICIOS.map(({ icon: Icon, label, desc }) => (
          <article key={label} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 hover:border-amber-500/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-slate-900/5 flex items-center justify-center mb-4">
              <Icon size={24} className="text-slate-900" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">{label}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
          </article>
        ))}
      </div>

      <p className="text-center mt-10 text-slate-600">
        ¿No ves tu artículo? <button onClick={() => scrollTo("#contacto")} className="text-amber-600 font-bold hover:underline">Consúltanos →</button>
      </p>
    </div>
  </section>
)

const Proceso = () => (
  <section id="proceso" className="py-24 px-6 bg-slate-950 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(245,158,11,0.25)_1px,transparent_1px)] bg-[size:28px_28px] opacity-20" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />

    <div className="max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-500 mb-3">Proceso simple</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">Obtén tu dinero en 4 pasos</h2>
        <p className="text-lg text-white/60 max-w-2xl mx-auto">Sin papeleo, sin esperas. Todo explicado con total claridad.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PASOS.map(paso => (
          <div key={paso.n} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-amber-500/50 transition-colors">
            <div className="font-black text-6xl text-amber-500/20 mb-4 select-none">{paso.n}</div>
            <h3 className="font-bold text-xl text-white mb-3">{paso.titulo}</h3>
            <p className="text-sm text-white/60 leading-relaxed">{paso.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {[
          { icon: Lock, title: "Artículos asegurados", desc: "Cada artículo queda registrado y guardado bajo llave durante el plazo del préstamo." },
          { icon: TrendingUp, title: "Precio de mercado", desc: "Tasamos según el valor real actual para garantizarte la mejor oferta posible." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
              <Icon size={24} className="text-amber-500" />
            </div>
            <div>
              <p className="font-bold text-white mb-1">{title}</p>
              <p className="text-xs text-white/50 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-3">Preguntas frecuentes</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Todo lo que necesitas saber</h2>
          <p className="text-slate-600 mb-8">Si no encuentras tu respuesta aquí, escríbenos directamente.</p>
          <button onClick={() => scrollTo("#contacto")} className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            Ir a contacto <ArrowRight size={18} />
          </button>
        </div>

        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {FAQS.map((faq, i) => (
            <div key={i} className={`border-b border-slate-200 last:border-0`}>
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-6 text-left"
              >
                <span className={`font-semibold transition-colors ${openIndex === i ? "text-amber-600" : "text-slate-900"}`}>{faq.p}</span>
                <ChevronDown size={20} className={`text-slate-400 shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`} />
              </button>
              <div className={`grid transition-all duration-300 ease-in-out ${openIndex === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-sm text-slate-600 leading-relaxed">{faq.r}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Footer = () => (
  <footer className="bg-slate-950 border-t border-white/10 py-10 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-amber-500 rounded-md flex items-center justify-center font-bold text-white text-xs">GC</div>
        <span className="font-bold text-white text-lg">Empeños GC</span>
      </div>
      <p className="text-sm text-white/40 text-center">© {new Date().getFullYear()} Empeños GC · Cochabamba, Bolivia. Todos los derechos reservados.</p>
      <p className="text-sm text-white/40 text-center">Empresa regulada · Proceso transparente</p>
    </div>
  </footer>
)

// ─── MAIN PAGE COMPONENT ─────────────────────────────────────────────────────

export default function Page() {
  return (
    <div className="font-sans text-slate-900 bg-slate-50 selection:bg-amber-500/30">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Servicios />
        <Proceso />
        <FAQ />
      </main>
      <Footer />

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${CONTACTO.whatsapp}?text=Hola,%20quiero%20consultar%20sobre%20un%20empe%C3%B1o.`}
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3 px-5 rounded-full shadow-2xl hover:scale-105 transition-all duration-300"
      >
        <MessageCircle size={20} />
        <span className="hidden sm:inline">¿Tienes dudas?</span>
      </a>
    </div>
  )
}