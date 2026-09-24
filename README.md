# Pendiente: frontend mobile

Prototipo navegable de la aplicación mobile **Pendiente**, implementado con React Native y Expo. Es una entrega de interfaces: los controles responden visualmente, pero no hay backend, cámara real, autenticación ni persistencia. Solo la navegación entre pantallas está programada.

## Stack y versiones

| Herramienta | Versión |
| --- | --- |
| Node.js (probado) | 26.8.2 (Expo SDK 54 requiere Node 20.19 o superior) |
| npm | 12.1.0 |
| Expo SDK | 54 (`expo ~54.0.0`) |
| React Native | 0.81.4 |
| React | 19.1.0 |
| expo-status-bar | ~3.0.8 |

Las versiones exactas de todas las dependencias quedan fijadas en `package-lock.json`.

## Ejecutar el proyecto

1. Clona el repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd pendiente-mobile-frontend
   ```

2. Instala las dependencias exactas del lockfile:

   ```bash
   npm ci
   ```

3. Inicia el servidor de desarrollo:

   ```bash
   npx expo start
   ```

4. Abre la app de una de estas formas:
   - **Emulador Android (recomendado):** con un emulador abierto en Android Studio (por ejemplo, un Pixel 7 con API 34), presiona `a` en la terminal de Expo. Expo instala automáticamente en el emulador la versión de Expo Go que corresponde a SDK 54.
   - **Teléfono Android:** instala Expo Go **para SDK 54** desde https://expo.dev/go (elige SDK 54). La versión de Google Play solo soporta el SDK más reciente y puede no abrir el proyecto. Luego escanea el código QR que aparece en la terminal. El teléfono y el computador deben estar en la misma red.
   - **Sin Expo Go:** instala la APK (ver la sección siguiente).

## APK instalable

La APK se genera con EAS Build usando el perfil `preview` de `eas.json` (tipo `apk`, distribución interna). Funciona en Android 8.1 (API 27) o superior; el mínimo de Expo SDK 54 es API 24.

```bash
npx eas-cli login
npx eas-cli build -p android --profile preview
```

La primera vez, EAS pide crear el proyecto en tu cuenta de Expo y agrega `extra.eas.projectId` a `app.json`. Al terminar, EAS muestra un enlace para descargar la APK.

**Enlace de descarga de la APK:** _pendiente (se agrega al generar el build)_

## Dispositivo de referencia (pixel-perfect)

Los mockups se diseñaron sobre un marco de **390 x 800 dp**. Las pantallas se maquetaron con esa geometría: posiciones, tamaños, radios, grosores de borde y colores salen directamente del generador de mockups de la entrega de UI Design (Style Tile "La noche y el amanecer"). Para comparar con Figma, usa un dispositivo o emulador de 390 dp de ancho o cercano (un Pixel 7, de 412 x 915 dp, deja espacio para la barra de estado y la barra de navegación). Las pantallas M5 a M8 empiezan debajo de la barra de estado de Android. En pantallas más anchas o más angostas, los elementos conservan sus márgenes laterales y se estiran a lo ancho.

La tipografía de los mockups es la sans serif del sistema (Liberation Sans al renderizar los SVG, Inter en la importación a Figma). En Android la app usa la sans serif del sistema (Roboto) con los mismos tamaños y pesos, sin cargar fuentes externas.

## Pantallas

- **M1 Mis alarmas:** lista, switches y botón flotante para crear alarma.
- **M2 Nueva alarma, formulario:** hora, días, propósito, foto opcional, verificación y sonido.
- **M3 Foto de propósito:** visor de cámara simulado con Galería y disparador.
- **M4 Nueva alarma con foto:** estado del formulario con foto y verificación.
- **M5 Selector de verificación:** Ninguna, Movimiento, Escanear objeto y Operación matemática, con nota de privacidad.
- **M6 Alarma sonando:** foto de propósito protagonista, Descartar y Posponer.
- **M7 Verificación por escaneo:** referencia guardada, visor simulado, Buscando y No puedo ahora.
- **M8 Confirmación:** "Listo, despertaste" y racha de martes.

## Navegación

- M1: el botón flotante o una fila abre M2/M4. Ajustes abre un modal.
- M4: la fila Verificación abre M5. El botón "Ver flujo de alarma sonando" abre M6.
- M5: la flecha o cualquier opción vuelve a M4 con la opción elegida.
- M6: Descartar abre M7. Posponer vuelve a M1.
- M7: tocar el visor simula que se reconoce el objeto y abre M8. "No puedo ahora" también abre M8.
- M8: Cerrar vuelve a M1.

## Estructura

```
App.js                 Estado de navegación y pantallas M1 a M4
theme.js               Tokens de color y utilidades de maquetación (M5 a M8)
components/            PhotoPills (foto de propósito) y CameraView (visor simulado)
screens/               M5 a M8, una pantalla por archivo
```

## Referencia de diseño

Figma (mobile):
https://www.figma.com/proto/iYEIPtxf5rfIvabAcStQ4B/Pendiente-%E2%80%94-Wireframes-y-prototipo?node-id=1-2&starting-point-node-id=1%3A2&scaling=scale-down&t=mx4XcBgasrViaMAR-1

## Distribución del trabajo

- **Natalia:** M1 Mis alarmas, M2 Nueva alarma, M3 Foto de propósito y M4 Nueva alarma con foto (`App.js`).
- **Santiago:** M5 Selector de verificación, M6 Alarma sonando, M7 Verificación por escaneo y M8 Confirmación (`screens/`, `components/`, `theme.js`).

La descripción detallada de los issues está en [`ISSUES.md`](ISSUES.md).
