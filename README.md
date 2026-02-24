# ConversIA — Landing Page Premium

> Automatización conversacional con IA para WhatsApp Business

## 🎨 Paleta de colores

| Token           | Valor       | Uso                          |
|-----------------|-------------|------------------------------|
| `--primary-400` | `#38BDF8`   | Acento principal (sky blue)  |
| `--primary-500` | `#0ea5e9`   | Hover / gradiente            |
| `--primary-600` | `#0284c7`   | Botones activos              |
| `--bg-primary`  | `#000000`   | Fondo base                   |
| `--bg-secondary`| `#09090B`   | Secciones alternadas         |
| `--bg-tertiary` | `#18181B`   | Cards, componentes           |
| `--text-primary`| `#FFFFFF`   | Títulos                      |
| `--text-tertiary`| `#A1A1AA`  | Texto secundario             |

## 📁 Estructura

```
ConversIA/
├── index.html          ← Estructura principal
├── styles.css          ← Todo el CSS (variables, componentes, responsive)
├── script.js           ← Animaciones, flip cards, contadores, formulario
├── README.md           ← Esta guía
└── images/
    ├── logo.png        ← Logo generado con IA
    ├── hero_visual.png ← Visual del hero
    ├── service_1.png   ← Captación de Leads
    ├── service_2.png   ← Atención al Cliente
    ├── service_3.png   ← Agendamiento de Turnos
    ├── service_4.png   ← Ventas por WhatsApp
    ├── service_5.png   ← Sector Inmobiliario
    └── service_6.png   ← Analytics & Datos
```

## 🚀 Cómo usar

1. Abrí `index.html` directamente en el navegador
2. Para editar colores: cambiá `--primary-400` en `styles.css`
3. Para editar contenido: editá los textos en `index.html`

## ✨ Features implementadas

- ✅ Partículas flotantes (50 partículas animadas)
- ✅ Navbar sticky con blur al hacer scroll
- ✅ Hero con animaciones de entrada
- ✅ Cards estadísticas con contadores animados
- ✅ Social proof / logos de plataformas
- ✅ **Flip cards 3D interactivas** con imágenes reales
- ✅ Sección de Proceso (4 pasos)
- ✅ Grid de industrias con glassmorphism
- ✅ Grid de integraciones tecnológicas
- ✅ Casos de uso con métricas animadas
- ✅ Testimonios con avatares
- ✅ Formulario CTA con validación y toast de confirmación
- ✅ Footer completo con links organizados
- ✅ Responsive completo (Mobile, Tablet, Desktop)
- ✅ Mobile menu hamburguesa
- ✅ Flip cards con tap en mobile

## 🔧 Personalización rápida

### Cambiar número de WhatsApp para el CTA:
En `script.js`, función `submitForm()`, podés redirigir a WhatsApp:
```js
window.open(`https://wa.me/54911XXXXXXXX?text=Hola, soy ${name} de ${company}`, '_blank');
```

### Cambiar el color principal:
En `styles.css`, cambiá estas 3 líneas:
```css
--primary-400: #38BDF8;   /* tu color */
--primary-rgb: 56, 189, 248;  /* valores RGB de tu color */
```

## 📱 Breakpoints

| Breakpoint | Dispositivo        |
|------------|--------------------|
| > 1024px   | Desktop            |
| 768–1023px | Tablet             |
| < 767px    | Mobile             |
| < 480px    | Mobile pequeño     |
