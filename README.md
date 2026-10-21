# Vice City Autos — Neon Underground

A fully standalone fictional 1980s Vice City exotic-car showroom created for **Glitch Hunt: Vice City**. The project is built with React, Vite, JavaScript, CSS, local SVG automotive illustrations, and local font files.

> All cars, names, customer records, and enquiries are fictional. Do not submit real personal or payment information.

## Windows PowerShell

Prerequisite: install a current Node.js LTS release (Node 20+ recommended).

```powershell
cd .\vice-city-autos
npm install
npm run dev
```

Open **http://localhost:3003**.

The Vite configuration uses `strictPort`, so the server will not silently pick a different port if `3003` is occupied.

## Production build

```powershell
npm run build
```

## Included routes and functionality

- Immersive full-screen Vice City night-time showroom homepage
- Inventory, Classics, and Performance catalogue routes
- Search, category, max-price, availability, and sort controls
- Vehicle detail pages with selectable original-illustration galleries
- Up-to-three-vehicle comparison bay
- Private enquiry and booking-request flow with generated references
- Browser-local comparison and fictional enquiry persistence
- Responsive desktop and laptop presentation with reduced-motion support

## Local visual assets

All car imagery is original, locally stored SVG automotive illustration under `src/assets/`. The hero includes a neon skyline, palms, wet-road reflections, and three exotic cars. Each vehicle uses a distinct illustration, while vehicle galleries also include separate garage and Ocean Drive scenes. No remote image service, CDN, API, font, or stylesheet is loaded at runtime.

## Local data reset

The comparison bay and fictional private enquiries are saved using browser `localStorage`. Clear site data for `localhost:3003` to restore the demo state.

## Project layout

```text
vice-city-autos/
├── src/
│   ├── assets/             # local SVG artwork and font files
│   ├── data.js             # fictional collection catalogue
│   ├── main.jsx            # routes, filtering, comparison, enquiry logic
│   └── styles.css          # neon showroom visual system and responsiveness
├── index.html
├── package.json
└── vite.config.js
```

## Event build

This event version contains twelve deliberately seeded, browser-reproducible Glitch Hunt scenarios. All other core experiences are intended to work normally. The detailed organizer answer key is intentionally excluded from the distributable project, source tree, and public frontend assets.


### Local car photography and neon background
The project includes bundled WebP images for the neon city supercar hero, electric blue sedan, classic convertible, off-road Jeep, muscle car, and luxury hatchback. The neon showroom background is also stored locally, so no remote image URLs are required.


### Additional coastal car photography
Eight additional locally bundled coastal driving photographs are included as WebP assets (`coastal-drive-1.webp` through `coastal-drive-8.webp`) and added to the vehicle detail galleries. They load locally without runtime internet access.

### Vehicle image gallery mapping
The coastal supercar photos are assigned only to the Veridian Azzuro supercar gallery. The classic convertible photos are assigned only to the Crosswind Caballero gallery. Other vehicles use their own primary image plus the existing generic dealership/coast artwork; unrelated coastal photos are not reused across every vehicle.
