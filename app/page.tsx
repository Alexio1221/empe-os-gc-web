"use client"

import { useState, useEffect, useRef } from "react"
import {
  Laptop, Wrench, Tv, Smartphone, Gamepad2, WashingMachine,
  Camera, Music, ShieldCheck, Clock, TrendingUp, Lock,
  Phone, MapPin, Mail, Menu, X, ChevronDown, ArrowRight,
  MessageCircle, Check, Target, Zap,
} from "lucide-react"
import ChatPage from "./chatbot/Bot"

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Servicios", href: "#servicios" },
  { label: "Cómo funciona", href: "#proceso" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "FAQ", href: "#faq" },
  { label: "Contacto", href: "#contacto" },
]

const SERVICIOS = [
  { icon: Smartphone, label: "Celulares", desc: "iPhone, Samsung, Xiaomi y más marcas." },
  { icon: Laptop, label: "Laptops", desc: "Cualquier marca y modelo en buen estado." },
  { icon: Gamepad2, label: "Consolas", desc: "PS5, Xbox, Nintendo Switch y anteriores." },
  { icon: Tv, label: "Televisores", desc: "Smart TVs y monitores de todas las pulgadas." },
  { icon: Wrench, label: "Herramientas", desc: "Taladros, amoladoras, compresores y más." },
  { icon: WashingMachine, label: "Electrodomésticos", desc: "Lavadoras, refrigeradoras, microondas." },
  { icon: Camera, label: "Cámaras", desc: "Réflex, mirrorless, drones y accesorios." },
  { icon: Music, label: "Instrumentos", desc: "Guitarras, teclados y equipos de audio." },
]

const PASOS = [
  { n: "01", titulo: "Trae tu artículo", desc: "Sin cita previa. Visítanos con el objeto que deseas empeñar." },
  { n: "02", titulo: "Tasación gratuita", desc: "Evaluamos tu artículo en minutos, sin compromiso." },
  { n: "03", titulo: "Recibe una oferta", desc: "Te presentamos una oferta clara y transparente, sin letras pequeñas." },
  { n: "04", titulo: "Dinero inmediato", desc: "Acepta y recibe efectivo en mano al instante. Así de simple." },
]

const STATS = [
  { valor: "15 min", label: "Tasación promedio" },
  { valor: "Sin filas", label: "Atención inmediata" },
  { valor: "100%", label: "Trato personalizado" },
]

const FAQS = [
  { p: "¿Qué artículos puedo empeñar?", r: "Aceptamos electrónica, herramientas, electrodomésticos, instrumentos musicales, cámaras y más. Si tienes dudas sobre un artículo puntual, consúltanos y te orientamos." },
  { p: "¿Cuánto tiempo tengo para recuperar mi artículo?", r: "El plazo estándar es de un mes, renovable pagando solo los intereses. Trabajamos con flexibilidad para adaptarnos a tu situación." },
  { p: "¿Cómo se calcula el monto del préstamo?", r: "Evaluamos el valor de mercado y el estado de su artículo. Al ser un contrato de empeño (garantía) y no una compra-venta, podemos ofrecerle hasta un 45% del valor estimado si el objeto se encuentra en perfecto estado." },
  { p: "¿Mis datos son confidenciales?", r: "Absolutamente. Toda la información que nos proporcionas se maneja con total discreción y confidencialidad." },
  { p: "¿Qué pasa si no puedo recuperar mi artículo?", r: "Puedes renovar el plazo pagando los intereses. Si no puedes recuperarlo, el artículo cubre el préstamo. Sin deudas adicionales ni cobros extra." },
  { p: "¿Qué documentos necesito?", r: "Solo tu documento de identidad vigente (CI) y tu objeto de prenda. Sin papeleo complicado ni trámites adicionales." },
]

const CONTACTO = {
  whatsapp: "59175140189",
  email: "casadeprestamosgc@gmail.com",
  direccion: "Calle Beneméritos de la Patria, entre Av. Villazón y Calle Colombia",
  ciudad: "Cochabamba-Sacaba, Bolivia",
  horarios: [
    { dia: "Lunes - Viernes", hora: "8:00 – 20:00" },
    { dia: "Sábado", hora: "10:00 – 17:00" },
    { dia: "Domingo", hora: "Cerrado" },
  ],
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function scrollTo(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(0)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      {/* ── GLOBAL STYLES (Tailwind v4 @theme + Google Fonts) ─────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }

        :root {
          --navy:        #0d1b35;
          --navy-mid:    #162850;
          --amber:       #d97706;
          --amber-hi:    #f59e0b;
          --cream:       #f8f4ee;
          --cream-dark:  #ede8de;
          --slate:       #5a6a82;
          --text:        #1a2338;

          --font-display: 'Fraunces', Georgia, serif;
          --font-body:    'DM Sans', system-ui, sans-serif;
        }

        body {
          font-family: var(--font-body);
          background: var(--cream);
          color: var(--text);
          line-height: 1.65;
        }

        h1,h2,h3,h4 {
          font-family: var(--font-display);
          line-height: 1.1;
        }

        :focus-visible { outline: 2px solid var(--amber); outline-offset: 3px; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: var(--cream); }
        ::-webkit-scrollbar-thumb { background: var(--navy); border-radius: 99px; }

        /* fade-up utility */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp .65s ease both; }
        .delay-1 { animation-delay: .1s; }
        .delay-2 { animation-delay: .2s; }
        .delay-3 { animation-delay: .3s; }
        .delay-4 { animation-delay: .45s; }
        .delay-5 { animation-delay: .6s; }

        /* pill badge */
        .badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: color-mix(in srgb, var(--amber) 15%, transparent);
          border: 1px solid color-mix(in srgb, var(--amber) 35%, transparent);
          color: var(--amber);
          font-size: .7rem; font-weight: 600; letter-spacing: .2em;
          text-transform: uppercase; padding: 5px 14px; border-radius: 99px;
        }

        /* grid dots bg */
        .dot-bg {
          background-image: radial-gradient(circle, color-mix(in srgb, var(--amber) 25%, transparent) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* service card hover */
        .service-card { transition: box-shadow .2s, border-color .2s, transform .2s; }
        .service-card:hover { box-shadow: 0 8px 32px color-mix(in srgb, var(--navy) 10%, transparent); transform: translateY(-2px); border-color: color-mix(in srgb, var(--amber) 50%, transparent) !important; }

        /* nav link */
        .nav-link { position:relative; color: rgba(255,255,255,.75); font-size:.875rem; padding: 4px 0; transition: color .2s; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:2px; background:var(--amber); transition:width .2s; border-radius:99px; }
        .nav-link:hover { color:#fff; }
        .nav-link:hover::after { width:100%; }

        /* faq */
        .faq-body { overflow: hidden; transition: max-height .35s ease, opacity .3s ease; }
      `}</style>

      {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
      <header
        style={{
          position: "fixed", inset: "0 0 auto", zIndex: 50,
          transition: "background .3s, box-shadow .3s",
          background: scrolled ? "rgba(13,27,53,.96)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 1px 0 rgba(255,255,255,.07)" : "none",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 10 }} aria-label="Inicio">
            <img
              src="/imagenes/Logo.png"
              alt="Logo Empeños G&C"
              style={{
                width: 80,
                height: 80,
                objectFit: "contain",
                borderRadius: 6
              }}
            />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#fff", fontSize: 18, letterSpacing: ".5px" }}>Empeños G&C</span>
          </a>

          {/* Desktop nav */}
          <nav style={{ display: "flex", gap: 4 }} className="hidden-mobile" aria-label="Principal">
            {NAV_LINKS.map(l => (
              <button key={l.href} onClick={() => scrollTo(l.href)} className="nav-link" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 14px" }}>{l.label}</button>
            ))}
          </nav>

          {/* burger */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setMenuOpen(v => !v)}
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "none" }}
              className="burger-btn"
              aria-label="Menú"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 40, background: "var(--navy)",
        display: "flex", flexDirection: "column", paddingTop: 80, paddingLeft: 24, paddingRight: 24,
        transition: "transform .3s", transform: menuOpen ? "translateX(0)" : "translateX(100%)",
      }}>
        {NAV_LINKS.map(l => (
          <button key={l.href}
            onClick={() => { scrollTo(l.href); setMenuOpen(false) }}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,.8)", textAlign: "left", fontSize: 18, fontFamily: "var(--font-display)", fontWeight: 700, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,.07)", cursor: "pointer" }}
          >{l.label}</button>
        ))}
      </div>

      <main>

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section ref={heroRef} style={{ position: "relative", minHeight: "100vh", background: "var(--navy)", display: "flex", alignItems: "center", overflow: "hidden" }}>
          {/* grid lines */}
          <div aria-hidden style={{
            position: "absolute", inset: 0, opacity: .045,
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
            backgroundSize: "64px 64px"
          }} />
          {/* amber glow */}
          <div aria-hidden style={{ position: "absolute", top: "-10%", right: "-5%", width: 600, height: 600, borderRadius: "50%", background: "color-mix(in srgb, var(--amber) 12%, transparent)", filter: "blur(100px)", pointerEvents: "none" }} />
          <div aria-hidden style={{ position: "absolute", bottom: "-15%", left: "-5%", width: 400, height: 400, borderRadius: "50%", background: "color-mix(in srgb, var(--amber) 6%, transparent)", filter: "blur(80px)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "160px 24px 120px", width: "100%", position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: 700 }}>
              <div className="badge fade-up" style={{ marginBottom: 28 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--amber)", display: "inline-block" }} />
                Préstamos inmediatos · Sacaba, Cochabamba
              </div>

              <h1 className="fade-up delay-1" style={{ fontSize: "clamp(2.6rem,6vw,5rem)", fontWeight: 900, color: "#fff", marginBottom: 24, letterSpacing: "-.02em" }}>
                Dinero inmediato<br />
                <span style={{ background: "linear-gradient(90deg, var(--amber-hi), var(--amber))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  por tus artículos.
                </span>
              </h1>

              <p className="fade-up delay-2" style={{ fontSize: "1.15rem", color: "rgba(255,255,255,.6)", maxWidth: 520, marginBottom: 40, lineHeight: 1.75 }}>
                Empeña celulares, laptops, herramientas, electrodomésticos y más.
                Evaluación justa, proceso transparente y efectivo en 15 minutos.
              </p>

              <div className="fade-up delay-3" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 56 }}>
                <button onClick={() => scrollTo("#proceso")}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--amber)", color: "#fff", fontWeight: 700, fontSize: 15, padding: "14px 28px", borderRadius: 8, border: "none", cursor: "pointer", transition: "background .2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--amber-hi)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "var(--amber)")}
                >
                  Cómo funciona <ArrowRight size={16} />
                </button>
              </div>

              {/* trust badges */}
              <div className="fade-up delay-4" style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
                {[
                  { icon: ShieldCheck, label: "100% Confidencial" },
                  { icon: Clock, label: "Dinero en 15 min" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={14} color="var(--amber)" />
                    </div>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,.55)" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* bottom svg divider */}
          <div aria-hidden style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
            <svg viewBox="0 0 1440 72" preserveAspectRatio="none" style={{ width: "100%", height: 72, display: "block" }}>
              <polygon points="0,72 1440,0 1440,72" fill="var(--cream)" />
            </svg>
          </div>
        </section>

        {/* ── STATS BAND ────────────────────────────────────────────────────── */}
        <section style={{ background: "var(--navy)", padding: "48px 24px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 24 }}>
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(2rem,4vw,3rem)", color: "#fff", lineHeight: 1 }}>
                  {s.valor.replace(/\d+/, m => m)}<span style={{ color: "var(--amber)" }}></span>
                </p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,.45)", marginTop: 8, letterSpacing: ".05em", textTransform: "uppercase" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SERVICIOS ─────────────────────────────────────────────────────── */}
        <section id="servicios" style={{ padding: "96px 24px", background: "var(--cream)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            {/* header */}
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".25em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 12 }}>¿Qué puedes empeñar?</p>
              <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, color: "var(--navy)", marginBottom: 16 }}>Artículos que aceptamos</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 20 }}>
              {SERVICIOS.map(({ icon: Icon, label, desc }) => (
                <article key={label} className="service-card" style={{ background: "#fff", border: "1.5px solid var(--cream-dark)", borderRadius: 14, padding: 28 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "color-mix(in srgb, var(--navy) 6%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <Icon size={20} color="var(--navy)" />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", color: "var(--navy)", marginBottom: 6 }}>{label}</h3>
                  <p style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.6 }}>{desc}</p>
                </article>
              ))}
            </div>

            <p style={{ textAlign: "center", marginTop: 36, fontSize: 14, color: "var(--slate)" }}>
              ¿No ves tu artículo?{" "}
              <button onClick={() => scrollTo("#contacto")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--amber)", fontWeight: 700, fontSize: 14, textDecoration: "underline", fontFamily: "var(--font-body)" }}>
                Consúltanos →
              </button>
            </p>
          </div>
        </section>

        {/* ── PROCESO ───────────────────────────────────────────────────────── */}
        <section id="proceso" style={{ padding: "96px 24px", background: "var(--navy)", position: "relative", overflow: "hidden" }}>
          <div aria-hidden className="dot-bg" style={{ position: "absolute", inset: 0, opacity: .07 }} />
          <div aria-hidden style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "color-mix(in srgb, var(--amber) 5%, transparent)", filter: "blur(80px)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".25em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 12 }}>Proceso simple</p>
              <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, color: "#fff", marginBottom: 16 }}>Obtén tu dinero en 4 pasos</h2>
              <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,.55)", maxWidth: 480, margin: "0 auto" }}>
                Sin papeleo, sin esperas. Todo explicado con total claridad.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 16 }}>
              {PASOS.map((paso, i) => (
                <div key={paso.n} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 14, padding: 28, position: "relative", transition: "border-color .2s" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = "color-mix(in srgb, var(--amber) 50%, transparent)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,.09)")}
                >
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "3.5rem", color: "color-mix(in srgb, var(--amber) 70%, transparent)", lineHeight: 1, marginBottom: 16, userSelect: "none" }}>{paso.n}</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#fff", fontSize: "1.1rem", marginBottom: 10 }}>{paso.titulo}</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.7 }}>{paso.desc}</p>
                </div>
              ))}
            </div>

            {/* guarantees */}
            <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 16, maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}>
              {[
                { icon: Lock, title: "Artículos asegurados", desc: "Cada artículo queda registrado y guardado durante el plazo del préstamo." },
                { icon: TrendingUp, title: "Precio de mercado", desc: "Tasamos según el valor real actual para garantizarte la mejor oferta posible." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} style={{ display: "flex", gap: 16, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "color-mix(in srgb, var(--amber) 18%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} color="var(--amber)" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: "#fff", fontSize: 14, marginBottom: 4 }}>{title}</p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,.45)", lineHeight: 1.6 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NOSOTROS ──────────────────────────────────────────────────────── */}
        <section id="nosotros" style={{ padding: "96px 24px", background: "#fff" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 64, alignItems: "center" }}>

            {/* === COLUMNA IZQUIERDA: TEXTO === */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".25em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 12 }}>Sobre Nosotros</p>

              <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 900, color: "var(--navy)", marginBottom: 20 }}>
                Una nueva forma de<br />
                <span style={{ color: "var(--amber)" }}> empeñar con confianza</span>
              </h2>

              <p style={{ color: "var(--slate)", lineHeight: 1.8, marginBottom: 16 }}>
                En <strong>Empeños G&C</strong> nacemos con un objetivo claro: ser la opción más honesta y rápida de la zona.
              </p>

              <p style={{ color: "var(--slate)", lineHeight: 1.8, marginBottom: 32 }}>
                Aquí no encontrarás letras chicas. Valoramos tus objetos con precios de mercado actuales y te explicamos cada detalle de tu préstamo para que recuperes tus pertenencias sin sorpresas.
              </p>

              {/* == Bloques Adicionales para Reforzar Mensaje == */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", borderTop: "1px solid #eee", paddingTop: "32px" }}>
                <div style={{ display: "flex", alignItems: "start", gap: "12px" }}>
                  <Target size={24} style={{ color: "var(--amber)", marginTop: "4px" }} />
                  <div>
                    <h4 style={{ fontWeight: 700, color: "var(--navy)", marginBottom: "4px" }}>Nuestra Misión</h4>
                    <p style={{ fontSize: "14px", color: "var(--slate)" }}>Ofrecer liquidez inmediata con trato justo y total discreción.</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "start", gap: "12px" }}>
                  <Zap size={24} style={{ color: "var(--amber)", marginTop: "4px" }} />
                  <div>
                    <h4 style={{ fontWeight: 700, color: "var(--navy)", marginBottom: "4px" }}>Compromiso</h4>
                    <p style={{ fontSize: "14px", color: "var(--slate)" }}>Tasar en 15 minutos y entregarte tu dinero al instante.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* === COLUMNA DERECHA: LOGO / IMAGEN DE MARCA === */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" }}>
              {/* Contenedor decorativo para el logo */}
              <div style={{
                position: "relative",
                width: "100%",
                maxWidth: "350px",
                aspectRatio: "1",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, rgba(var(--amber-rgb), 0.1) 0%, rgba(var(--navy-rgb), 0.05) 100%)", // Un fondo sutil con tus colores
                borderRadius: "50%", // Puede ser circular para suavizar
                boxShadow: "0 20px 40px rgba(0,0,0,0.05)"
              }}>
                {/* La Imagen del Logo */}
                <img
                  src="/imagenes/logoGrande.webp" 
                  alt="Logo Grande Empeños G&C - Transparencia y Honestidad"
                  style={{
                    width: "100%", // El logo no debe tocar los bordes del círculo
                    height: "auto",
                    objectFit: "contain",
                    filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.1))" // Sombra suave al logo mismo
                  }}
                />

                {/* Decoración sutil (opcional, un aro alrededor) */}
                <div style={{
                  position: "absolute",
                  top: "-10px",
                  left: "-10px",
                  right: "-10px",
                  bottom: "-10px",
                  border: "2px solid rgba(var(--amber-rgb), 0.2)",
                  borderRadius: "50%"
                }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <section id="faq" style={{ padding: "96px 24px", background: "var(--cream)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 64, alignItems: "start" }}>
            {/* sticky left */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".25em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 12 }}>Preguntas frecuentes</p>
              <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 900, color: "var(--navy)", marginBottom: 16 }}>Todo lo que necesitas saber</h2>
              <p style={{ color: "var(--slate)", lineHeight: 1.8, marginBottom: 28 }}>
                Si no encuentras tu respuesta aquí, escríbenos directamente.
              </p>
              <button onClick={() => scrollTo("#contacto")}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--navy)", color: "#fff", fontWeight: 600, fontSize: 13, padding: "12px 20px", borderRadius: 8, border: "none", cursor: "pointer", transition: "background .2s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--navy-mid)")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--navy)")}
              >
                Ir a contacto <ArrowRight size={14} />
              </button>
            </div>

            {/* accordion */}
            <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1.5px solid var(--cream-dark)" }}>
              {FAQS.map((faq, i) => (
                <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? "1px solid var(--cream-dark)" : "none" }}>
                  <button
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    aria-expanded={faqOpen === i}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "20px 24px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                  >
                    <span style={{ fontWeight: 600, fontSize: 14, color: faqOpen === i ? "var(--amber)" : "var(--navy)", transition: "color .2s" }}>{faq.p}</span>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "transform .3s", transform: faqOpen === i ? "rotate(180deg)" : "rotate(0deg)" }}>
                      <ChevronDown size={13} color="var(--slate)" />
                    </div>
                  </button>
                  <div className="faq-body" style={{ maxHeight: faqOpen === i ? 200 : 0, opacity: faqOpen === i ? 1 : 0 }}>
                    <p style={{ padding: "0 24px 20px", fontSize: 13, color: "var(--slate)", lineHeight: 1.75 }}>{faq.r}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BAND ──────────────────────────────────────────────────────── */}
        <section style={{ background: "var(--amber)", padding: "72px 24px", position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 22px,rgba(0,0,0,.04) 22px,rgba(0,0,0,.04) 44px)" }} />
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 28, position: "relative", zIndex: 1 }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(1.6rem,3.5vw,2.5rem)", color: "#fff", marginBottom: 8 }}>¿Necesitas efectivo hoy?</h2>
              <p style={{ color: "rgba(255,255,255,.8)", fontSize: "1rem" }}>Visítanos o escríbenos. En 15 minutos tienes el dinero en mano.</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a href={`https://wa.me/${CONTACTO.whatsapp}`} target="_blank" rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--navy)", color: "#fff", fontWeight: 700, padding: "14px 24px", borderRadius: 8, textDecoration: "none", fontSize: 14, transition: "background .2s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--navy-mid)")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--navy)")}
              >
                <MessageCircle size={16} /> WhatsApp <ArrowRight size={14} />
              </a>
              <button onClick={() => scrollTo("#contacto")}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.2)", color: "#fff", fontWeight: 600, padding: "14px 24px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, transition: "background .2s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,.3)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,.2)")}
              >
                Ver dirección
              </button>
            </div>
          </div>
        </section>

        {/* ── CONTACTO ──────────────────────────────────────────────────────── */}
        <section id="contacto" style={{ padding: "96px 24px", background: "#fff" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".25em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 12 }}>Encuéntranos</p>
              <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, color: "var(--navy)" }}>Estamos para ayudarte</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: 20 }}>
              {/* WhatsApp card */}
              <div style={{ borderRadius: 16, display: "flex", flexDirection: "column", gap: 16 }}>
                <ChatPage />
              </div>

              {/* Info grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }} className="info-grid">
                {[
                  { icon: MapPin, title: "Dirección", lines: [CONTACTO.direccion, CONTACTO.ciudad] },
                  { icon: Mail, title: "Email", lines: [CONTACTO.email] },
                ].map(({ icon: Icon, title, lines }) => (
                  <div key={title} style={{ background: "var(--cream)", border: "1.5px solid var(--cream-dark)", borderRadius: 12, padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <Icon size={15} color="var(--amber)" />
                      <span style={{ fontWeight: 600, fontSize: 13, color: "var(--navy)" }}>{title}</span>
                    </div>
                    {lines.map(l => (
                      <p key={l} style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.6 }}>{l}</p>
                    ))}
                  </div>
                ))}

                {/* Horarios */}
                <div style={{ background: "var(--cream)", border: "1.5px solid var(--cream-dark)", borderRadius: 12, padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <Clock size={15} color="var(--amber)" />
                    <span style={{ fontWeight: 600, fontSize: 13, color: "var(--navy)" }}>Horarios</span>
                  </div>
                  {CONTACTO.horarios.map(h => (
                    <div key={h.dia} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "var(--slate)" }}>{h.dia}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: h.hora === "Cerrado" ? "#ef4444" : "var(--navy)" }}>{h.hora}</span>
                    </div>
                  ))}
                </div>

                {/* Garantías */}
                <div style={{ background: "var(--cream)", border: "1.5px solid var(--cream-dark)", borderRadius: 12, padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <ShieldCheck size={15} color="var(--amber)" />
                    <span style={{ fontWeight: 600, fontSize: 13, color: "var(--navy)" }}>Garantías</span>
                  </div>
                  {["Empresa registrada", "Proceso 100% transparente", "Total confidencialidad", "Artículos asegurados"].map(g => (
                    <div key={g} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                      <Check size={11} color="var(--amber)" />
                      <span style={{ fontSize: 12, color: "var(--slate)" }}>{g}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ────────────────────────────────────────────────────────────── */}
      <footer style={{ background: "var(--navy)", borderTop: "1px solid rgba(255,255,255,.07)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, background: "var(--amber)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 900, color: "#fff", fontSize: 12 }}>G&C</div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#fff", fontSize: 16 }}>Empeños G&C</span>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.3)" }}>© {new Date().getFullYear()} Empeños G&C · Sacaba, Cochabamba. Todos los derechos reservados.</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.3)" }}>Empresa registrada · Proceso transparente</p>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP ─────────────────────────────────────────────────── */}
      <a href={`https://wa.me/${CONTACTO.whatsapp}?text=Hola,%20quiero%20consultar%20sobre%20un%20empe%C3%B1o.`}
        target="_blank" rel="noreferrer"
        aria-label="Contactar por WhatsApp"
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 50,
          display: "flex", alignItems: "center", gap: 8,
          background: "#25D366", color: "#fff",
          fontWeight: 700, fontSize: 13,
          padding: "12px 18px", borderRadius: 99,
          textDecoration: "none", boxShadow: "0 8px 28px rgba(0,0,0,.25)",
          transition: "background .2s, transform .2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "#1ebe5d"; e.currentTarget.style.transform = "scale(1.04)" }}
        onMouseLeave={e => { e.currentTarget.style.background = "#25D366"; e.currentTarget.style.transform = "scale(1)" }}
      >
        <MessageCircle size={18} />
        <span>Contáctanos</span>
      </a>

      {/* ── RESPONSIVE OVERRIDES ──────────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .burger-btn    { display: flex !important; }
          .info-grid     { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .info-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}