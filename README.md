# SIVSA Web — Primer Avance

Sitio web institucional para **SIVSA — Servicios de Ingeniería Vial S.A. de C.V.**

Concepto visual: **Capa Técnica + Reflejo** — antracita profundo, grid blueprint, señalización amber, efecto retroreflectivo en Three.js.

---

## Stack

- HTML5 + CSS3 + JavaScript vanilla
- **Three.js r160** (escena 3D hero: carretera en perspectiva con marcas animadas)
- Google Fonts: Barlow Condensed · Barlow · JetBrains Mono
- Sin frameworks · Sin bundler · GitHub Pages listo

---

## Estructura

```
sivsa-web/
├── index.html
├── assets/
│   ├── css/
│   │   └── style.css       ← Design system completo
│   └── js/
│       ├── hero.js         ← Three.js scene
│       └── app.js          ← Navbar, scroll, counters, cursor glow
└── README.md
```

---

## Deploy en GitHub Pages

1. Sube la carpeta a un repositorio en GitHub (ej. `sivsa-web`)
2. Ve a **Settings → Pages**
3. En *Source* selecciona **Deploy from a branch**
4. Branch: `main` · Folder: `/ (root)` → **Save**
5. En ~60 segundos el sitio estará en `https://[usuario].github.io/sivsa-web/`

> **Nota:** Three.js se carga desde jsDelivr CDN. El sitio requiere conexión a internet para funcionar.

---

## Secciones

| # | Sección | Descripción |
|---|---|---|
| 1 | Hero | Escena 3D (Three.js), texto con entrada animada, badges |
| 2 | Nosotros | Historia de empresa, misión/valores, estadísticas con contador |
| 3 | Servicios | 4 cards con íconos SVG draw-on-hover |
| 4 | Proyectos | 6 obras destacadas del portafolio (datos reales del PDF) |
| 5 | Certificación | Spotlight Triple-A PPG USA 2024 |
| 6 | Contacto | Formulario (FormSubmit) + datos de contacto |
| 7 | Footer | Navegación + contacto |

---

## Paleta

| Variable | Color | Uso |
|---|---|---|
| `--amber` | `#F5C518` | Señalización, CTAs, métricas clave |
| `--blue` | `#3D8EF0` | Elementos técnicos, bordes, tags |
| `--bg-deep` | `#070A0F` | Fondo base |
| `--bg-card` | `#0F1520` | Cards y superficies |
| `--text-1` | `#E8EDF5` | Texto principal |
| `--text-2` | `#8A95A8` | Texto secundario |

---

## Three.js — Descripción de la escena

- **Cámara:** `(0, 1.8, 5.5)` mirando hacia `(0, 0, -20)` — perspectiva de conductor
- **Plano de carretera:** `PlaneGeometry(20, 120)` centrado en `z=-50`
- **Grid blueprint:** `LineSegments` azul `0x3D8EF0`, opacidad 3.8%
- **Líneas de orilla:** blanco semitransparente en `x=±4.2`
- **Guiones centrales:** 24 `BoxGeometry` amber, velocidad +Z `0.068`/frame, reciclado infinito
- **Partículas retroreflectivas:** 900 puntos concentrados en marcas viales, titilado con `sin/cos`
- **Scan beam:** plano amber delgado que barre la carretera
- **Fog:** `FogExp2(0x070A0F, 0.028)` — profundidad
- **Mouse parallax:** cámara suavizada con lerp, amplitud `±0.48` en X

---

## Formulario de contacto

El formulario usa [FormSubmit.co](https://formsubmit.co/) (servicio gratuito para sites estáticos).  
Primera vez que alguien envíe un mensaje, FormSubmit enviará un correo de activación a `operaciones@sivsamx.com`. Tras confirmar, todos los mensajes llegarán directamente.

---

## Próximos pasos sugeridos

- [ ] Agregar imágenes reales de proyectos (`.webp`)
- [ ] Logo SVG de SIVSA en navbar y footer
- [ ] Testimoniales / clientes
- [ ] Google Analytics / GTM
- [ ] Dominio personalizado en GitHub Pages (`sivsamx.com`)
- [ ] Versión en inglés (i18n)
