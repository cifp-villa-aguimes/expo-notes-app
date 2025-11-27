# 📱 Expo NotesApp – Plan de Desarrollo

> Documento de planificación para recrear la **NotesApp** de Jetpack Compose en **Expo / React Native con TypeScript**.
>
> Orientado al módulo **PGL – Programación Multimedia y Dispositivos Móviles (DAM)**, como continuación natural de la UT3.

---

## 📋 Índice

1. [Objetivo del proyecto](#-objetivo-del-proyecto)
2. [Comparativa Compose vs Expo](#-comparativa-compose-vs-expo)
3. [Visión general de la app](#-visión-general-de-la-app)
4. [Versionado pedagógico](#-versionado-pedagógico)
5. [Arquitectura](#-arquitectura)
6. [Estructura de carpetas](#-estructura-de-carpetas)
7. [Modelos y tipos TypeScript](#-modelos-y-tipos-typescript)
8. [Pantallas y navegación](#-pantallas-y-navegación)
9. [Estado global y persistencia](#-estado-global-y-persistencia)
10. [Integración de APIs](#-integración-de-apis)
11. [Integración de sensores](#-integración-de-sensores)
12. [Componentes reutilizables clave](#-componentes-reutilizables-clave)
13. [Tecnologías y dependencias](#-tecnologías-y-dependencias)
14. [Cronograma orientativo](#-cronograma-orientativo)
15. [Checklist por versión](#-checklist-por-versión)
16. [Recursos y referencias](#-recursos-y-referencias)

---

## 🎯 Objetivo del proyecto

Recrear la **NotesApp Typed** (Compose) en el ecosistema **Expo / React Native**, manteniendo la misma filosofía:

- App de **notas** sencilla pero completa.
- Pensada como **demo arquitectónica** y ejercicio integrador.
- Uso intensivo de **estado global**, **persistencia** y **navegación**.
- Añadiendo en esta versión RN:
  - Consumo de **API de citas** (notas inspiracionales).
  - Uso de **sensores** (shake-to-create) con `expo-sensors`.

### Objetivos didácticos

El alumnado debe comprender y practicar:

- Cómo estructurar una app con **Expo Router** (file-based routing).
- Cómo usar **TypeScript** de forma idiomática en RN.
- Cómo gestionar **estado global** con **Zustand** (similar a StateFlow + ViewModel).
- Cómo persistir:
  - **Preferencias** con **AsyncStorage** (equivalente a DataStore).
  - **Datos estructurados** con **SQLite** (equivalente a Room).
- Cómo integrar **APIs HTTP** con Axios (gestión de errores, loading, etc.).
- Cómo integrar **sensores** (acelerómetro) y **feedback háptico**.
- Cómo diseñar una UI coherente: Home, Favoritos, Ajustes, Detalle.

---

## 🔄 Comparativa Compose vs Expo

| Concepto               | Jetpack Compose                             | Expo / React Native                     |
| ---------------------- | ------------------------------------------- | --------------------------------------- |
| UI declarativa         | `@Composable`                               | Componentes funcionales JSX             |
| Estado local           | `remember { mutableStateOf() }`             | `useState`, `useReducer`                |
| Estado global          | `StateFlow` + ViewModel                     | **Zustand** stores                      |
| Navegación             | Navigation Compose + rutas tipadas          | **Expo Router** (file-based, tipado TS) |
| Persistencia ligera    | **DataStore Preferences**                   | **AsyncStorage**                        |
| Persistencia estruct.  | **Room**                                    | **expo-sqlite**                         |
| Inyección dependencias | Service Locator / Hilt                      | Hooks + stores + servicios              |
| Temas                  | `MaterialTheme`                             | contexto + stores + estilos             |
| Scaffold/Layout        | `Scaffold` (TopBar, FAB, BottomBar, Sheets) | Layout manual + Tabs + modales          |
| HTTP                   | Retrofit / Ktor                             | Axios / fetch                           |
| Sensores               | SensorManager                               | `expo-sensors` + `expo-haptics`         |

La app de Expo será la **traducción conceptual** de la app Compose, no un calco 1:1 de UI.

---

## 🧠 Visión general de la app

**Funcionalidades básicas (equivalentes a Compose):**

- Login con **nickname** + captcha matemático (no hay backend real).
- Pantallas:
  - Login
  - Home (todas las notas)
  - Favoritos
  - Ajustes
  - Detalle de nota
- Notas:
  - Crear
  - Editar
  - Eliminar (swipe-to-delete)
  - Marcar/desmarcar como favorita
- Ajustes:
  - Cambiar nombre de usuario
  - Cambiar orden de notas (fecha, título, favoritas primero)
  - Tema claro/oscuro

**Extensiones específicas Expo:**

- Botón para **crear nota desde una cita** traída de una API pública.
- **Shake-to-create**: al agitar el móvil se abre el formulario de nueva nota.

---

## 🧱 Versionado pedagógico

Se propone avanzar en **5 versiones incrementales**, en paralelo conceptual con las 5 versiones Jetpack.

### v0.1.0 – Navegación básica con Expo Router

**Objetivo**: tener el esqueleto de pantallas y navegación.

- Crear proyecto con `create-expo-app` (plantilla tabs + TypeScript).
- Configurar Expo Router (grupo `(tabs)` para Home/Favoritos/Ajustes).
- Implementar las 5 pantallas con contenido mínimo.
- Login:
  - Campo de nickname.
  - Captcha matemático simple (suma/resta) validado en cliente.
- Navegación:
  - Login → Tabs tras pulsar "Entrar" válido.
  - Tab bar con 3 pestañas.
  - Ruta dinámica `note/[id].tsx` para detalle.

### v0.2.0 – Estado global en memoria (Zustand)

**Objetivo**: centralizar el estado, sin persistencia todavía.

- Añadir **Zustand**.
- Stores:
  - `useUserStore`: nickname + estado login.
  - `useSettingsStore`: orden de notas, tema, flags UI.
  - `useNotesStore`: lista de notas + CRUD.
- Implementar todas las operaciones de notas en memoria.
- Ordenación de notas según `settings.sortBy`.
- Tema claro/oscuro gestionado desde `useSettingsStore` y aplicado en el layout raíz.

### v0.3.0 – Persistencia ligera con AsyncStorage

**Objetivo**: persistir **preferencias** y **usuario**.

- Instalar `@react-native-async-storage/async-storage`.
- Usar middleware `persist` de Zustand en:
  - `useUserStore` (nickname, loggedIn).
  - `useSettingsStore` (tema, orden, `welcomeShown`, `shakeEnabled`).
- Comprobar que al cerrar/abrir la app se mantiene:
  - usuario logueado,
  - tema,
  - preferencias de orden,
  - toggle de shake.

### v0.4.0 – Persistencia estructurada con SQLite

**Objetivo**: migrar notas a base de datos real.

- Instalar `expo-sqlite`.
- Definir **schema**:

  ```sql
  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT,
    is_favorite INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    created_by TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);
  CREATE INDEX IF NOT EXISTS idx_notes_is_favorite ON notes(is_favorite);
  ```

- Crear capa DAO-like en `src/services/database/`:
  - `getAllNotes(sortBy)`
  - `getNoteById(id)`
  - `insertNote(note)`
  - `updateNote(note)`
  - `deleteNote(id)`
  - `toggleFavorite(id)`
- Conectar `useNotesStore` para que use SQLite en lugar de arrays en memoria.
- Manejar loading/error al inicializar notas.

### v0.5.0 – API + Sensores

**Objetivo**: añadir llamadas HTTP y sensores.

- API de citas (por ejemplo `https://zenquotes.io/api/random`).
- Botón en **Ajustes** o en Home:
  - Llama a la API.
  - Muestra loading.
  - Si éxito: crea una nota con título = cita, cuerpo = "— Autor".
  - Si error: muestra mensaje.
- **Sensor**:
  - Integrar `expo-sensors` (acelerómetro).
  - Hook `useShakeDetector` que dispara callback cuando el usuario agita el móvil.
  - Ajuste en Settings: `shakeEnabled`.
  - Cuando está activo y se detecta shake → abrir sheet de nueva nota + vibración con `expo-haptics`.

---

## 🏛️ Arquitectura

### Visión por capas

```text
┌─────────────────────────────────────────────────────────────┐
│                       PRESENTATION                          │
│  app/ (Expo Router)                                        │
│  - Layout raíz (_layout.tsx)                               │
│  - Login, Tabs, Home, Favs, Settings, NoteDetail           │
└───────────────▲────────────────────────────────────────────┘
                │ usa hooks de estado
┌───────────────┴────────────────────────────────────────────┐
│                    STATE / DOMAIN                          │
│  src/stores/ (Zustand)                                     │
│  - useUserStore, useSettingsStore, useNotesStore           │
└───────────────▲────────────────────────────────────────────┘
                │ llama a servicios
┌───────────────┴────────────────────────────────────────────┐
│                         DATA                               │
│  src/services/database  → expo-sqlite                      │
│  src/services/api       → Axios                            │
│  AsyncStorage           → persistencia stores              │
│  src/services/sensors   → expo-sensors, expo-haptics      │
└─────────────────────────────────────────────────────────────┘
```

### Principios

- **UI tonta, lógica en hooks/stores**.
- Una sola fuente de verdad para:
  - usuario,
  - notas,
  - ajustes.
- La UI nunca habla directamente con SQLite/AsyncStorage, siempre a través de stores/servicios.
- Evitar anidar lógica compleja en componentes; preferir hooks dedicados.

---

## 📁 Estructura de carpetas

```text
expo-notes-app/
├── app/                          # Rutas (Expo Router)
│   ├── _layout.tsx               # Layout raíz: tema, providers
│   ├── index.tsx                 # Login
│   ├── (tabs)/                   # Grupo de pestañas
│   │   ├── _layout.tsx           # BottomTabNavigator
│   │   ├── index.tsx             # Home – todas las notas
│   │   ├── favorites.tsx         # Favoritos
│   │   └── settings.tsx          # Ajustes
│   └── note/
│       └── [id].tsx              # Detalle de nota
│
├── src/
│   ├── components/
│   │   ├── ui/                   # Botones, inputs, sheets genéricos
│   │   ├── notes/                # NoteCard, SwipeableNoteCard, etc.
│   │   └── login/                # MathCaptcha, campos específicos
│   │
│   ├── stores/                   # Zustand stores
│   │   ├── useUserStore.ts
│   │   ├── useSettingsStore.ts
│   │   └── useNotesStore.ts
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts         # Axios instance + interceptors
│   │   │   └── quotesApi.ts      # API de citas
│   │   ├── database/
│   │   │   ├── schema.ts         # creación / migración DB
│   │   │   ├── notesDao.ts       # funciones CRUD
│   │   │   └── migrations.ts     # (opcional) versiones de schema
│   │   └── sensors/
│   │       └── shakeDetector.ts  # lógica de shakes
│   │
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   ├── useShakeDetector.ts
│   │   └── useNotes.ts           # selectores y lógica composta
│   │
│   ├── types/
│   │   ├── note.ts
│   │   ├── user.ts
│   │   └── settings.ts
│   │
│   ├── utils/
│   │   ├── validation.ts         # nickname, captcha, formularios
│   │   ├── formatters.ts         # fechas, textos auxiliares
│   │   └── constants.ts
│   │
│   └── theme/
│       ├── colors.ts
│       ├── spacing.ts
│       └── typography.ts
│
├── assets/
│   ├── images/
│   └── fonts/
│
├── app.json                      # Configuración Expo
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧾 Modelos y tipos TypeScript

### Notas

```ts
// src/types/note.ts

export interface Note {
  id: string;
  title: string;
  body: string;
  isFavorite: boolean;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
  createdBy: string; // nickname de usuario
}

export interface NoteFormData {
  title: string;
  body?: string;
  isFavorite?: boolean;
}

// Representación para SQLite
export interface NoteEntity {
  id: string;
  title: string;
  body: string | null;
  is_favorite: number; // 0 o 1
  created_at: number;
  updated_at: number;
  created_by: string;
}
```

### Usuario

```ts
// src/types/user.ts

export interface User {
  name: string;
  isLoggedIn: boolean;
}
```

### Ajustes

```ts
// src/types/settings.ts

export type SortBy = "date" | "title" | "favorites";
export type ThemeMode = "light" | "dark" | "system";

export interface Settings {
  theme: ThemeMode;
  sortBy: SortBy;
  welcomeShown: boolean;
  shakeEnabled: boolean;
}
```

---

## 🧭 Pantallas y navegación

### Flujo general

```text
Login (index.tsx)
  ↓ (login exitoso)
(tabs)/_layout.tsx  → BottomTabNavigator
  ├─ (tabs)/index.tsx        → Home (todas las notas)
  ├─ (tabs)/favorites.tsx    → Favoritos
  └─ (tabs)/settings.tsx     → Ajustes

note/[id].tsx      → Detalle de nota (accesible desde Home/Favoritos)
```

### Login

- Componentes:
  - Campo nickname (TextInput con contador de caracteres).
  - Captcha: componente `MathCaptcha`.
  - Botón "Entrar" desactivado hasta que:
    - nickname válido (3–30 chars),
    - captcha correcto.
- Estado:
  - local para formularios,
  - `useUserStore.login(name)` al entrar.

### Home

- Header: "Notas — {userName}".
- Lista (FlatList) de `SwipeableNoteCard`.
- FAB para añadir nota.
- Sheet/modal con formulario de nota (`NoteForm`).
- Ordenación según `settings.sortBy`.
- Empty state con CTA para crear primera nota.

### Favoritos

- Mismo layout que Home, pero filtrando `isFavorite === true`.
- Mensaje si no hay favoritas.

### Ajustes

- Sección Perfil:
  - Campo de nickname editable.
  - Botones: Guardar, Revertir (volver al almacenado), Limpiar.
- Sección Orden de notas:
  - Radio buttons: fecha, título, favoritas primero.
- Sección Tema:
  - Toggle tema oscuro + opción "seguir sistema" (opcional).
- Sección API:
  - Botón "Añadir nota desde cita" (v0.5.0).
- Sección Sensores:
  - Toggle "Shake to create".

### Detalle de nota

- Muestra título, cuerpo, timestamps y autor.
- Botones:
  - Editar (abre mismo formulario que Home pero precargado).
  - Favorito on/off.
  - Eliminar con confirmación.

---

## 🔄 Estado global y persistencia

### Stores principales (Zustand)

#### `useUserStore`

Responsabilidades:

- Guardar nombre y estado de login.
- Ofrecer acciones `login`, `logout`, `updateName`.
- Persistido en AsyncStorage.

#### `useSettingsStore`

Responsabilidades:

- Guardar `theme`, `sortBy`, `welcomeShown`, `shakeEnabled`.
- Acciones para cambiarlos.
- Persistido en AsyncStorage.

#### `useNotesStore`

Responsabilidades:

- Lista de `notes`.
- Flags `isLoading`, `error`.
- Acciones async:
  - `loadNotes()`
  - `addNote(formData, userName)`
  - `updateNote(id, formData)`
  - `deleteNote(id)`
  - `toggleFavorite(id)`
  - `getNoteById(id)`

Implementación por versión:

- **v0.2.0**: todo en memoria (arrays + `set`).
- **v0.4.0**: llamadas reales a `notesDao` (SQLite) dentro de las acciones.

---

## 🌐 Integración de APIs

### API de citas (ejemplo)

Se puede usar **ZenQuotes** (no requiere key para pruebas):

- Endpoint: `https://zenquotes.io/api/random`
- Respuesta: array con un objeto `{ q: string; a: string; }`.

Flujo:

1. Usuario pulsa "Añadir nota desde cita".
2. Mostrar estado `loading` mientras se llama a la API.
3. Si éxito → crear nota con:
   - `title = quote.q` (recortado a X chars si es muy largo).
   - `body = "— ${quote.a}"`.
4. Si error → Snackbar/Toast informando del fallo.

Responsabilidades:

- `src/services/api/client.ts` → crea instancia Axios, timeouts, interceptores.
- `src/services/api/quotesApi.ts` → función `getRandomQuote()`.
- Hook `useQuote()` (opcional) para encapsular loading/error.

---

## 📡 Integración de sensores

### Shake-to-create

Caso de uso:

- El usuario activa un toggle "Shake to create" en Ajustes.
- Mientras está en Home:
  - Si agita el móvil por encima de cierto umbral → vibración + apertura del formulario de nueva nota.

Implementación propuesta:

- Hook `useShakeDetector({ enabled, onShake })` que:
  - Suscribe al acelerómetro (`Accelerometer.addListener`).
  - Calcula la norma de (x,y,z).
  - Si supera el umbral y ha pasado cierto tiempo → dispara `onShake()`.
  - Lanza `Haptics.notificationAsync(...)` como feedback.

Integración con UI:

- En Home:
  - `const { shakeEnabled } = useSettingsStore();`
  - `useShakeDetector({ enabled: shakeEnabled, onShake: () => setIsAddSheetOpen(true) });`

---

## 🧩 Componentes reutilizables clave

- `MathCaptcha` (login):

  - Genera una operación sencilla.
  - Muestra mensajes de error en rojo.
  - Expone `onValidChange(isValid: boolean)`.

- `SwipeableNoteCard` (home/favoritos):

  - Basado en `react-native-gesture-handler`.
  - Acción de swipe derecho/izquierdo para eliminar.
  - Icono de estrella para favoritos.

- `NoteForm` (sheet/modal):

  - Campos: título (obligatorio, máx. 80 chars), contenido (opcional), toggle favorito.
  - Botones Guardar / Cancelar.

- Componentes UI base (`Button`, `Input`, `Card`):
  - Facilitan consistencia visual y pedagógica.

---

## 🧪 Tecnologías y dependencias

**Core**

- `expo` (SDK 54)
- `react-native` (0.81+)
- `expo-router`
- `typescript`

**Estado y persistencia**

- `zustand`
- `@react-native-async-storage/async-storage`
- `expo-sqlite`
- (opcional) `expo-secure-store` para credenciales reales en futuros proyectos.

**UI / gestos / animaciones**

- `react-native-gesture-handler`
- `react-native-reanimated`
- `@expo/vector-icons`
- `expo-haptics`

**API y sensores**

- `axios`
- `expo-sensors`

**Herramientas de desarrollo**

- `eslint` + `@react-native-community/eslint-config`
- `prettier`

---

## 🎨 Estilos y sistema de diseño

La app usará inicialmente **StyleSheet** clásico con un pequeño sistema de diseño propio,
y dejará **NativeWind** como extensión opcional (para una versión avanzada o rama aparte).

### Enfoque base (UT3)

- **Tokens de diseño** en `src/theme/`:
  - `colors.ts`: paleta clara/oscura, colores semánticos (primary, surface, error...).
  - `spacing.ts`: escalas de margen/padding (4, 8, 12, 16, 24...).
  - `typography.ts`: tamaños y pesos de texto.
- Componentes base en `src/components/ui/` (`Button`, `Input`, `Card`):
  - Reciben solo props funcionales (`variant`, `disabled`, etc.).
  - Aplican internamente los estilos del sistema de diseño.
- Soporte de tema claro/oscuro:
  - `useSettingsStore.theme` controla el tema.
  - Hook `useTheme()` expone colores/resolved theme para los componentes.
- Objetivo didáctico:
  - Reforzar conocimientos de **StyleSheet**, Flexbox y diseño responsivo en RN.
  - Mostrar cómo centralizar estilos sin depender aún de una librería externa.

### Extensión opcional: NativeWind

Para una versión posterior (p.ej. rama `v0.6.0-nativewind`) se puede integrar
**NativeWind** para que el alumnado vea un enfoque tipo Tailwind en React Native.

Propuesta de integración:

- Instalar NativeWind y configurar el `tailwind.config.js` mapeando los tokens:
  - Colores (`primary`, `surface`, etc.) → `theme.extend.colors`.
  - Tipografía y tamaños → `fontSize`, `fontWeight`.
- Mantener el **sistema de diseño como fuente de verdad** y usar NativeWind
  como capa de ergonomía (clases), no como sustituto completo.
- Empezar migrando solo algunas vistas:
  - Layout de `Login` y `Home`.
  - Tarjetas de nota (`NoteCard`) y botones principales.
- Comparar con el alumnado:
  - Ventajas: velocidad de maquetación, consistencia.
  - Inconvenientes: clases largas, posible acoplamiento a Tailwind.

### ¿GlueStack + NativeWind?

- GlueStack aporta un set completo de componentes y tokens ya predefinidos,
  pero añade bastante **complejidad conceptual y de configuración**.
- Para esta UT3, se recomienda **no incorporar GlueStack** y centrarse en:
  - Fundamentos de RN + StyleSheet.
  - Estado, persistencia, navegación, sensores y APIs.
  - (Opcional) NativeWind como módulo avanzado.

De esta forma, los estilos apoyan el objetivo didáctico sin eclipsar
los conceptos principales de arquitectura y persistencia.

---

## ⏱️ Cronograma orientativo

| Versión | Contenido principal                        | Días estimados |
| ------: | ------------------------------------------ | -------------: |
|  v0.1.0 | Navegación, pantallas base, login+captcha  |            2–3 |
|  v0.2.0 | Zustand + CRUD notas en memoria            |              2 |
|  v0.3.0 | Persistencia preferencias (AsyncStorage)   |            1–2 |
|  v0.4.0 | SQLite + migración de notas                |            2–3 |
|  v0.5.0 | API citas + sensores (shake)               |              2 |
|  Polish | Refinar UI, documentación, pruebas básicas |            1–2 |

Total orientativo: **10–14 días** de trabajo.

---

## ✅ Checklist por versión

### v0.1.0 – Navegación básica

- [ ] Crear proyecto Expo con plantilla tabs y TypeScript.
- [ ] Configurar `tsconfig` y alias `@/`.
- [ ] Implementar pantallas: Login, Home, Favoritos, Ajustes, Detalle.
- [ ] Añadir `MathCaptcha` en Login.
- [ ] Navegación Login → Tabs.
- [ ] Navegación a Detalle desde Home/Favoritos.
- [ ] Estilos base (colores, spacing, tipografía).

### v0.2.0 – Estado global (en memoria)

- [ ] Instalar y configurar Zustand.
- [ ] Crear `useUserStore` y conectarlo a Login.
- [ ] Crear `useSettingsStore` (tema, orden, shakeEnabled).
- [ ] Crear `useNotesStore` con CRUD en memoria.
- [ ] Wirear Home/Favoritos/Ajustes con los stores.
- [ ] Implementar SwipeableNoteCard.
- [ ] Implementar NoteForm en sheet/modal.

### v0.3.0 – Persistencia ligera

- [ ] Instalar AsyncStorage.
- [ ] Añadir middleware `persist` a `useUserStore` y `useSettingsStore`.
- [ ] Verificar que nickname, tema y orden persisten.
- [ ] Añadir flag `welcomeShown` (si se quiere splash o diálogo inicial).

### v0.4.0 – SQLite

- [ ] Instalar `expo-sqlite`.
- [ ] Diseñar schema + creación de tabla.
- [ ] Implementar `notesDao` con funciones CRUD.
- [ ] Crear mappers entre `NoteEntity` y `Note`.
- [ ] Modificar `useNotesStore` para usar DAO.
- [ ] Manejar estados de carga y error.

### v0.5.0 – API + sensores

- [ ] Instalar Axios y crear `apiClient`.
- [ ] Implementar `quotesApi.getRandomQuote()`.
- [ ] Añadir botón "Añadir nota desde cita" y conectar con `addNote`.
- [ ] Instalar `expo-sensors` y `expo-haptics`.
- [ ] Implementar hook `useShakeDetector`.
- [ ] Añadir toggle `shakeEnabled` en Ajustes.
- [ ] Conectar `useShakeDetector` en Home.

---

## 📚 Recursos y referencias

- Repositorio Compose original: `https://github.com/cifp-villa-aguimes/jetpack-notes-app`
- Expo Router: https://docs.expo.dev/router/introduction/
- Zustand: https://zustand-demo.pmnd.rs/
- AsyncStorage: https://react-native-async-storage.github.io/async-storage/
- expo-sqlite: https://docs.expo.dev/versions/latest/sdk/sqlite/
- expo-sensors: https://docs.expo.dev/versions/latest/sdk/sensors/

---

**Documento creado**: Noviembre 2025  
**Propósito**: Guía de desarrollo para el proyecto **Expo NotesApp** en UT3 – Apps Multiplataforma.
