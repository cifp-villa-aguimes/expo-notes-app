# 📱 Expo Notes App

Aplicación de notas multiplataforma desarrollada con **Expo / React Native + TypeScript**.

> Proyecto didáctico del módulo **PGL – DAM** como ejercicio integrador de arquitectura, estado, persistencia y APIs.

## 🎯 Objetivo

Recrear la **NotesApp** de Jetpack Compose en el ecosistema Expo, manteniendo la misma filosofía arquitectónica pero adaptada a React Native.

## 📊 Estado del Proyecto

| Versión | Estado        | Descripción                 |
| ------- | ------------- | --------------------------- |
| v0.0.0  | ✅ Completado | Limpieza y base mínima      |
| v0.1.0  | ✅ Completado | Navegación + Login          |
| v0.2.0  | ✅ Completado | Estado global (Zustand)     |
| v0.3.0  | ✅ Completado | Persistencia (AsyncStorage) |
| v0.4.0  | ✅ Completado | SQLite                      |
| v0.5.0  | 🔲 Pendiente  | API + Sensores              |
| v0.5.5  | 🔲 Pendiente  | Multimedia + Animaciones    |

## 🛠️ Stack Tecnológico

| Tecnología        | Versión | Uso                |
| ----------------- | ------- | ------------------ |
| Expo SDK          | 54      | Framework          |
| React Native      | 0.81.5  | UI nativa          |
| TypeScript        | 5.9.2   | Tipado             |
| Expo Router       | 6.0.15  | Navegación         |
| Zustand           | 5.0.8   | Estado global      |
| AsyncStorage      | 2.1.2   | Persistencia prefs |
| expo-sqlite       | 15.1.3  | Persistencia notas |
| Axios             | -       | Cliente HTTP       |
| expo-sensors      | -       | Acelerómetro       |
| expo-image-picker | -       | Captura multimedia |

## ✨ Funcionalidades Planeadas

- **Login** con nickname + captcha matemático
- **CRUD de notas** con swipe-to-delete
- **Favoritos** con filtrado
- **Ajustes**: tema, orden, perfil
- **API de citas** para crear notas inspiracionales
- **Shake-to-create**: agitar para nueva nota
- **Imágenes en notas**: captura de cámara/galería
- **Animaciones**: transiciones fluidas con Reanimated

## 📁 Estructura (Objetivo Final)

```
expo-notes-app/
├── app/                      # Rutas (Expo Router)
│   ├── _layout.tsx           # Layout raíz
│   ├── index.tsx             # Login
│   ├── (tabs)/               # Tabs principales
│   │   ├── index.tsx         # Home
│   │   ├── favorites.tsx     # Favoritos
│   │   └── settings.tsx      # Ajustes
│   └── note/[id].tsx         # Detalle nota
│
├── src/
│   ├── components/           # Componentes
│   │   ├── ui/               # Button, Input, Card
│   │   ├── notes/            # NoteCard, NoteForm
│   │   └── login/            # MathCaptcha
│   ├── stores/               # Zustand stores
│   ├── services/             # API, DB, Sensors
│   ├── hooks/                # Custom hooks
│   ├── types/                # TypeScript interfaces
│   ├── utils/                # Validación, formatters
│   └── theme/                # Colores, spacing
│
└── assets/                   # Imágenes y recursos
```

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npx expo start
```

### Atajos de teclado

- **a** → Android
- **i** → iOS Simulator
- **w** → Web

## 📚 Documentación

- [`EXPO_NOTES_APP_PLAN.md`](./EXPO_NOTES_APP_PLAN.md) – Plan general del proyecto
- [`PLAN_VERSIONES.md`](./PLAN_VERSIONES.md) – Plan detallado por versión

## 🔗 Referencias

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Proyecto Compose original](https://github.com/cifp-villa-aguimes/jetpack-notes-app)
