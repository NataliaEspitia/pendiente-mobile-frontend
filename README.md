# Pendiente — frontend mobile

Prototipo navegable de la aplicación mobile **Pendiente**, implementado con React Native + Expo. Está pensado como entrega de interfaces: los controles son interactivos, pero no hay backend, cámara real, autenticación ni persistencia.

## Pantallas incluidas

- **M1 — Mis alarmas**: lista, switches y FAB de creación.
- **M2 — Nueva alarma, formulario**: hora, días, propósito, foto opcional, verificación y sonido.
- **M3 — Foto de propósito**: visor de cámara simulado con Galería y disparador.
- **M4 — Nueva alarma con foto**: estado del formulario con foto y verificación.
- **M5 — Selector de verificación**: Ninguna, Movimiento, Escanear objeto y Operación matemática + nota de privacidad.
- **M6 — Alarma sonando**: foto protagonista, Descartar y Posponer.
- **M7 — Verificación por escaneo**: referencia, visor simulado, Buscando, No puedo ahora.
- **M8 — Confirmación**: “Listo, despertaste” y racha de martes.

## Interacciones demostrativas

- Switches de alarmas y ajustes.
- FAB y filas de alarma abren el formulario.
- Chips de días seleccionables.
- Input de propósito editable.
- Añadir/quitar foto y flujo de cámara simulado.
- Selector de verificación con radios.
- Sonido cambia entre opciones al tocarlo.
- Flujo completo de alarma sonando → escaneo → confirmación.

## Ejecutar

Requiere Node.js y Expo.

```bash
npm install
npm start
```

Después podés abrirlo en Expo Go o en un emulador Android/iOS.

## Referencia de diseño

Figma (mobile):
https://www.figma.com/proto/iYEIPtxf5rfIvabAcStQ4B/Pendiente-%E2%80%94-Wireframes-y-prototipo?node-id=1-2&starting-point-node-id=1%3A2&scaling=scale-down&t=mx4XcBgasrViaMAR-1

## Distribución del trabajo

- **Natalia:** M1 Mis alarmas, M2 Nueva alarma, M3 Foto de propósito y M4 Nueva alarma con foto.
- **Santiago:** M5 Selector de verificación, M6 Alarma sonando, M7 Verificación por escaneo y M8 Confirmación.

La descripción detallada de los issues está en [`ISSUES.md`](ISSUES.md).
