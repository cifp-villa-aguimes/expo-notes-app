# 📱 Expo Notes App

<div align="center">

![Expo](https://img.shields.io/badge/Expo-54.0-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

**Aplicación de notas multiplataforma con Expo / React Native + TypeScript**

</div>

---

## 📋 Descripción

Proyecto didáctico del módulo **PGL – DAM** que recrea la **NotesApp** de Jetpack Compose en el ecosistema Expo. Implementa arquitectura moderna, gestión de estado, persistencia local, integración con APIs externas y uso de sensores del dispositivo.

## ✨ Características

### 🔐 Autenticación

- Login con nickname personalizado
- Captcha matemático anti-bots
- Persistencia de sesión con AsyncStorage

### 📝 Gestión de Notas

- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Swipe-to-delete con animación
- Sistema de favoritos
- Ordenación por fecha, alfabético o favoritos primero
- Imágenes adjuntas (cámara/galería)
- Persistencia en SQLite

### 🎨 Interfaz

- Tema claro/oscuro automático o manual
- Animaciones fluidas con Reanimated
- Diseño responsive
- Componentes reutilizables

### 🌐 Integraciones

- **API de citas**: Crea notas inspiracionales desde ZenQuotes
- **Imágenes aleatorias**: Lorem Picsum para fondos
- **Shake-to-create**: Agita el dispositivo para crear nota
- **Feedback háptico**: Vibración al detectar shake

---

## 📊 Estado del Proyecto

| Versión | Estado | Descripción              | Dependencias                      |
| ------- | ------ | ------------------------ | --------------------------------- |
| v0.0.0  | ✅     | Base mínima              | -                                 |
| v0.1.0  | ✅     | Navegación + Login       | expo-router                       |
| v0.2.0  | ✅     | Estado global            | zustand                           |
| v0.3.0  | ✅     | Persistencia prefs       | async-storage                     |
| v0.4.0  | ✅     | Persistencia notas       | expo-sqlite                       |
| v0.5.0  | ✅     | API + Sensores           | axios, expo-sensors, expo-haptics |
| v0.5.5  | ✅     | Multimedia + Animaciones | expo-image-picker, reanimated     |

---

## 🛠️ Stack Tecnológico

### Core

| Tecnología   | Versión | Descripción                   |
| ------------ | ------- | ----------------------------- |
| Expo SDK     | 54.0    | Framework de desarrollo       |
| React Native | 0.81.5  | UI nativa multiplataforma     |
| TypeScript   | 5.9.2   | Tipado estático               |
| Expo Router  | 6.0.15  | Navegación basada en archivos |

### Estado y Persistencia

| Tecnología   | Versión | Descripción            |
| ------------ | ------- | ---------------------- |
| Zustand      | 5.0.8   | Estado global ligero   |
| AsyncStorage | 2.2.0   | Persistencia key-value |
| expo-sqlite  | 16.0.9  | Base de datos SQLite   |

### APIs y Sensores

| Tecnología   | Versión | Descripción  |
| ------------ | ------- | ------------ |
| Axios        | 1.13.2  | Cliente HTTP |
| expo-sensors | 15.0.7  | Acelerómetro |
| expo-haptics | 15.0.7  | Vibración    |

### Multimedia

| Tecnología              | Versión | Descripción          |
| ----------------------- | ------- | -------------------- |
| expo-image              | 3.0.10  | Imágenes optimizadas |
| expo-image-picker       | 17.0.8  | Cámara y galería     |
| react-native-reanimated | 4.1.1   | Animaciones          |

---

## 📁 Estructura del Proyecto

```
expo-notes-app/
├── app/                          # Rutas (Expo Router)
│   ├── _layout.tsx               # Layout raíz + inicialización DB
│   ├── index.tsx                 # Splash + redirección
│   ├── login.tsx                 # Pantalla de login
│   ├── (tabs)/                   # Navegación por tabs
│   │   ├── _layout.tsx           # Configuración de tabs
│   │   ├── home.tsx              # Lista de notas
│   │   ├── favorites.tsx         # Notas favoritas
│   │   └── settings.tsx          # Ajustes de la app
│   └── note/
│       └── [id].tsx              # Detalle de nota
│
├── src/
│   ├── components/
│   │   ├── ui/                   # Componentes base
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── FAB.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── BottomSheet.tsx
│   │   ├── notes/                # Componentes de notas
│   │   │   ├── NoteCard.tsx
│   │   │   ├── NoteForm.tsx
│   │   │   ├── SwipeableNoteCard.tsx
│   │   │   ├── AnimatedNoteCard.tsx
│   │   │   └── ImageSelector.tsx
│   │   └── login/
│   │       └── MathCaptcha.tsx
│   │
│   ├── stores/                   # Estado global (Zustand)
│   │   ├── useUserStore.ts       # Usuario + sesión
│   │   ├── useNotesStore.ts      # Notas + CRUD
│   │   └── useSettingsStore.ts   # Preferencias
│   │
│   ├── services/
│   │   ├── api/                  # Servicios HTTP
│   │   │   ├── client.ts         # Axios con interceptores
│   │   │   ├── quotesApi.ts      # API de citas
│   │   │   └── imagesApi.ts      # API de imágenes
│   │   ├── database/             # SQLite
│   │   │   ├── db.ts             # Conexión
│   │   │   ├── schema.ts         # Esquema
│   │   │   ├── notesDao.ts       # CRUD
│   │   │   └── mappers.ts        # Entity ↔ Domain
│   │   └── sensors/
│   │       └── shakeDetector.ts  # Detector de movimiento
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── useTheme.ts           # Tema light/dark
│   │   ├── useShakeDetector.ts   # Hook de shake
│   │   └── useImagePicker.ts     # Hook de cámara/galería
│   │
│   ├── config/
│   │   └── env.ts                # Variables de entorno
│   │
│   ├── types/                    # Interfaces TypeScript
│   │   └── note.ts               # Note, NoteFormData, NoteEntity
│   │
│   ├── theme/                    # Sistema de diseño
│   │   ├── colors.ts             # Paleta light/dark
│   │   ├── spacing.ts            # Espaciados
│   │   └── typography.ts         # Estilos de texto
│   │
│   └── utils/
│       └── noteUtils.ts          # Ordenación, filtrado
│
├── .env                          # Variables de entorno
├── app.json                      # Configuración Expo
└── package.json
```

---

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator / Android Emulator / Expo Go

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/expo-notes-app.git
cd expo-notes-app

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npx expo start
```

### Comandos disponibles

| Comando                    | Descripción                      |
| -------------------------- | -------------------------------- |
| `npx expo start`           | Inicia el servidor de desarrollo |
| `npx expo start -c`        | Limpia caché e inicia            |
| `npx expo start --android` | Abre en Android                  |
| `npx expo start --ios`     | Abre en iOS Simulator            |
| `npm run lint`             | Ejecuta ESLint                   |

### Atajos en terminal

| Tecla | Acción                   |
| ----- | ------------------------ |
| `a`   | Abrir en Android         |
| `i`   | Abrir en iOS Simulator   |
| `w`   | Abrir en navegador web   |
| `m`   | Abrir menú de desarrollo |
| `r`   | Recargar app             |

---

## ⚙️ Variables de Entorno

Crear archivo `.env` en la raíz:

```env
# API de citas (ZenQuotes)
EXPO_PUBLIC_QUOTES_API_URL=https://zenquotes.io/api/random

# API de imágenes aleatorias (Lorem Picsum)
EXPO_PUBLIC_IMAGES_API_URL=https://picsum.photos

# Timeout para peticiones HTTP (ms)
EXPO_PUBLIC_API_TIMEOUT=10000
```

> ⚠️ **Nota educativa**: Normalmente `.env` no se sube a Git. Aquí se incluye con fines didácticos.

---

## 🔌 APIs Externas

### ZenQuotes API

- **URL**: `https://zenquotes.io/api/random`
- **Uso**: Obtener citas inspiracionales para crear notas
- **Límite**: Sin autenticación, uso libre

### Lorem Picsum

- **URL**: `https://picsum.photos`
- **Uso**: Imágenes aleatorias para notas
- **Formato**: `https://picsum.photos/{width}/{height}?random={id}`

---

## 📱 Funcionalidades por Pantalla

### 🏠 Home

- Lista de notas con animaciones de entrada
- Swipe izquierdo para eliminar
- FAB para crear nueva nota
- Shake-to-create (agitar dispositivo)
- Modal de bienvenida (primera vez)

### ⭐ Favoritos

- Notas marcadas como favoritas
- Misma funcionalidad que Home

### ⚙️ Ajustes

- Editar nombre de usuario
- Cambiar tema (Light/Dark/Sistema)
- Ordenar notas (fecha/alfabético/favoritos)
- Crear nota desde cita aleatoria
- Toggle shake-to-create
- Resetear bienvenida
- Cerrar sesión

### 📄 Detalle de Nota

- Vista completa de la nota
- Imagen ampliada (si tiene)
- Editar / Eliminar
- Toggle favorito en header

---

## 🧪 Probar Funcionalidades

### Shake-to-create

- **iOS Simulator**: `Cmd + Ctrl + Z` o Device → Shake
- **Android Emulator**: Extended Controls → Virtual Sensors
- **Dispositivo real**: Agitar físicamente

### Permisos

La app solicita permisos para:

- 📷 **Cámara**: Tomar fotos para notas
- 🖼️ **Galería**: Seleccionar imágenes existentes

---

## 📚 Documentación Adicional

| Archivo                                              | Descripción                |
| ---------------------------------------------------- | -------------------------- |
| [`EXPO_NOTES_APP_PLAN.md`](./EXPO_NOTES_APP_PLAN.md) | Plan general del proyecto  |
| [`PLAN_VERSIONES.md`](./PLAN_VERSIONES.md)           | Plan detallado por versión |

---

## 🎓 Criterios de Evaluación Cubiertos

### RA2 – Desarrollo de Aplicaciones Móviles

| Criterio | Descripción                                           | Implementación                                             |
| -------- | ----------------------------------------------------- | ---------------------------------------------------------- |
| **c)**   | Conexión y comunicación con dispositivos inalámbricos | Comunicación HTTP con APIs REST (Axios)                    |
| **d)**   | Funcionalidades proporcionadas por los sensores       | `expo-sensors` - Acelerómetro para shake detection         |
| **e)**   | Conexiones y comunicaciones HTTP/HTTPS                | Cliente Axios con interceptores, ZenQuotes API, Picsum API |
| **h)**   | Empaquetado y despliegue en dispositivos reales       | Expo Go, `npx expo run:ios/android`                        |
| **j)**   | Permisos requeridos para funcionamiento               | Cámara, galería, sensores configurados en `app.json`       |

### RA3 – Integración de Contenidos Multimedia

| Criterio | Descripción                                        | Implementación                                       |
| -------- | -------------------------------------------------- | ---------------------------------------------------- |
| **a)**   | Entornos de desarrollo multimedia                  | Expo SDK con expo-image, expo-image-picker           |
| **b)**   | Captura, procesamiento y almacenamiento multimedia | `useImagePicker` hook - cámara y galería             |
| **c)**   | Conversión de datos multimedia                     | expo-image con resize, quality, aspect ratio         |
| **d)**   | Procesar datos multimedia                          | Compresión de imágenes, blurhash placeholders        |
| **e)**   | Control de eventos, tipos de media y excepciones   | onLoad, onError, manejo de permisos denegados        |
| **f)**   | Creación y control de animaciones                  | react-native-reanimated - FadeIn, Layout transitions |
| **g)**   | Reproducir contenidos multimedia                   | expo-image para visualización optimizada             |
| **h)**   | Depuración y documentación                         | README, PLAN_VERSIONES, comentarios JSDoc            |

---

## 🔗 Referencias

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [expo-image](https://docs.expo.dev/versions/latest/sdk/image/)
- [Proyecto Compose original](https://github.com/cifp-villa-aguimes/jetpack-notes-app)

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver [`LICENSE`](./LICENSE) para más detalles.

---

<div align="center">

**Desarrollado con ❤️ para PGL – DAM**

</div>
