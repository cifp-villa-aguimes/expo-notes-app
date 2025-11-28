# 📋 Plan Detallado por Versión – Expo NotesApp

> Plan de implementación incremental basado en `EXPO_NOTES_APP_PLAN.md`
>
> Cada versión se desarrolla en su rama, se mergea a `main` y se sube a GitHub.

---

## 🧹 v0.0.0 – Limpieza y Base Mínima

**Objetivo**: Eliminar código de demo y preparar la estructura base para el desarrollo.

### Flujo Git

```bash
git checkout -b v0.0.0-base
# ... trabajo ...
git add . && git commit -m "v0.0.0: Base mínima del proyecto"
git checkout main && git merge v0.0.0-base
git tag v0.0.0
git push origin main --tags
```

### Tareas

#### 1. Eliminar archivos de demo

- [ ] `app/(tabs)/explore.tsx` → eliminar
- [ ] `app/modal.tsx` → eliminar (se recreará después)
- [ ] `components/external-link.tsx` → eliminar
- [ ] `components/hello-wave.tsx` → eliminar
- [ ] `components/parallax-scroll-view.tsx` → eliminar
- [ ] `components/ui/collapsible.tsx` → eliminar

#### 2. Simplificar archivos existentes

- [ ] `app/(tabs)/index.tsx` → dejar placeholder mínimo ("Home")
- [ ] `app/(tabs)/_layout.tsx` → simplificar tabs
- [ ] `app/_layout.tsx` → limpiar, mantener estructura básica

#### 3. Crear estructura de carpetas `src/`

```
src/
├── components/
│   ├── ui/          # Componentes base (Button, Input, Card)
│   ├── notes/       # NoteCard, NoteForm, etc.
│   └── login/       # MathCaptcha
├── stores/          # Zustand stores
├── services/
│   ├── api/         # Cliente Axios
│   ├── database/    # SQLite DAO
│   └── sensors/     # Shake detector
├── hooks/           # Custom hooks
├── types/           # TypeScript interfaces
├── utils/           # Validación, formatters
└── theme/           # Colores, spacing, typography
```

#### 4. Configurar alias `@/` en TypeScript

- [ ] Actualizar `tsconfig.json` con paths

#### 5. Actualizar README con estado actual

### Resultado esperado

- Proyecto limpio sin código de demo
- Estructura `src/` creada (carpetas vacías con `.gitkeep`)
- Una sola pantalla placeholder en Home
- Listo para empezar v0.1.0

---

## 🧭 v0.1.0 – Navegación Básica con Expo Router

**Objetivo**: Esqueleto de pantallas, navegación completa y login funcional.

### Flujo Git

```bash
git checkout -b v0.1.0-navigation
# ... trabajo ...
git add . && git commit -m "v0.1.0: Navegación básica y login"
git checkout main && git merge v0.1.0-navigation
git tag v0.1.0
git push origin main --tags
```

### Tareas

#### 1. Sistema de diseño base

- [ ] `src/theme/colors.ts` → paleta clara/oscura
- [ ] `src/theme/spacing.ts` → escala de espaciado (4, 8, 12, 16, 24, 32)
- [ ] `src/theme/typography.ts` → tamaños y pesos de texto
- [ ] Hook `src/hooks/useTheme.ts` → exponer colores según tema

#### 2. Tipos TypeScript

- [ ] `src/types/note.ts` → `Note`, `NoteFormData` (incluir `imageUrl?: string`)
- [ ] `src/types/user.ts` → `User`
- [ ] `src/types/settings.ts` → `Settings`, `SortBy`, `ThemeMode`

#### 3. Pantalla Login (`app/index.tsx`)

- [ ] Campo nickname con validación (3-30 chars)
- [ ] Contador de caracteres
- [ ] Componente `MathCaptcha` (`src/components/login/MathCaptcha.tsx`)
  - Genera operación aleatoria (suma/resta)
  - Valida respuesta
  - Expone `onValidChange(isValid: boolean)`
- [ ] Botón "Entrar" deshabilitado hasta validación
- [ ] Navegación a tabs tras login exitoso

#### 4. Configurar navegación tabs

- [ ] `app/(tabs)/_layout.tsx` → 3 tabs (Home, Favoritos, Ajustes)
- [ ] Iconos apropiados para cada tab
- [ ] `app/(tabs)/index.tsx` → Home placeholder
- [ ] `app/(tabs)/favorites.tsx` → Favoritos placeholder
- [ ] `app/(tabs)/settings.tsx` → Ajustes placeholder

#### 5. Ruta dinámica para detalle

- [ ] `app/note/[id].tsx` → Pantalla detalle placeholder
- [ ] Navegación desde Home/Favoritos al detalle

#### 6. Componentes UI base

- [ ] `src/components/ui/Button.tsx`
- [ ] `src/components/ui/Input.tsx`
- [ ] `src/components/ui/Card.tsx`

#### 7. Utilidades

- [ ] `src/utils/validation.ts` → validar nickname, captcha

### Resultado esperado

- Login funcional con captcha matemático
- Navegación completa: Login → Tabs → Detalle
- 3 tabs funcionando (contenido placeholder)
- Sistema de diseño básico aplicado
- Tipado TypeScript completo

---

## 🗃️ v0.2.0 – Estado Global en Memoria (Zustand)

**Objetivo**: Centralizar estado con Zustand, CRUD de notas en memoria.

### Flujo Git

```bash
git checkout -b v0.2.0-zustand
# ... trabajo ...
git add . && git commit -m "v0.2.0: Estado global con Zustand"
git checkout main && git merge v0.2.0-zustand
git tag v0.2.0
git push origin main --tags
```

### Dependencias

```bash
npm install zustand
```

### Tareas

#### 1. Store de usuario

- [ ] `src/stores/useUserStore.ts`
  - Estado: `name`, `isLoggedIn`
  - Acciones: `login(name)`, `logout()`, `updateName(name)`
- [ ] Conectar Login con el store
- [ ] Mostrar nombre en header de Home

#### 2. Store de ajustes

- [ ] `src/stores/useSettingsStore.ts`
  - Estado: `theme`, `sortBy`, `welcomeShown`, `shakeEnabled`
  - Acciones: setters para cada campo
- [ ] Aplicar tema en layout raíz

#### 3. Store de notas

- [ ] `src/stores/useNotesStore.ts`
  - Estado: `notes[]`, `isLoading`, `error`
  - Acciones:
    - `addNote(formData, userName)`
    - `updateNote(id, formData)`
    - `deleteNote(id)`
    - `toggleFavorite(id)`
    - `getNoteById(id)`
  - Selector: `getSortedNotes(sortBy)`

#### 4. Pantalla Home completa

- [ ] `FlatList` de notas con `NoteCard`
- [ ] FAB para añadir nota
- [ ] Modal/Sheet con `NoteForm`
- [ ] Empty state cuando no hay notas
- [ ] Ordenación según `settings.sortBy`

#### 5. Componentes de notas

- [ ] `src/components/notes/NoteCard.tsx`
  - Muestra título, preview del body, fecha, icono favorito
  - Imagen opcional (si `imageUrl` existe)
  - Navegación al detalle al pulsar
- [ ] `src/components/notes/SwipeableNoteCard.tsx`
  - Extiende NoteCard
  - Swipe para eliminar
- [ ] `src/components/notes/NoteForm.tsx`
  - Campos: título (obligatorio, max 80), body, toggle favorito
  - Botones: Guardar, Cancelar
  - Modo crear/editar

#### 6. Pantalla Favoritos

- [ ] Mismo layout que Home
- [ ] Filtrar `notes.filter(n => n.isFavorite)`
- [ ] Mensaje si no hay favoritos

#### 7. Pantalla Ajustes

- [ ] Sección Perfil: editar nickname
- [ ] Sección Orden: radio buttons (fecha, título, favoritos primero)
- [ ] Sección Tema: toggle oscuro/claro

#### 8. Pantalla Detalle

- [ ] Mostrar nota completa (título, body, fechas, autor)
- [ ] Botón editar (abre NoteForm)
- [ ] Botón favorito toggle
- [ ] Botón eliminar con confirmación

### Resultado esperado

- CRUD completo de notas (en memoria)
- Estado centralizado en 3 stores
- UI funcional en todas las pantallas
- Tema claro/oscuro funcionando
- Ordenación de notas funcionando

---

## 💾 v0.3.0 – Persistencia Ligera (AsyncStorage)

**Objetivo**: Persistir preferencias y datos de usuario.

### Flujo Git

```bash
git checkout -b v0.3.0-async-storage
# ... trabajo ...
git add . && git commit -m "v0.3.0: Persistencia con AsyncStorage"
git checkout main && git merge v0.3.0-async-storage
git tag v0.3.0
git push origin main --tags
```

### Dependencias

```bash
npm install @react-native-async-storage/async-storage
```

### Tareas

#### 1. Configurar middleware persist en Zustand

- [ ] `useUserStore` → persistir `name`, `isLoggedIn`
- [ ] `useSettingsStore` → persistir `theme`, `sortBy`, `welcomeShown`, `shakeEnabled`

#### 2. Gestión de hidratación

- [ ] Mostrar splash/loading mientras se hidratan los stores
- [ ] Redirigir automáticamente si usuario ya logueado

#### 3. Verificaciones

- [ ] Usuario persiste tras cerrar/abrir app
- [ ] Tema persiste
- [ ] Orden de notas persiste
- [ ] Toggle shake persiste

#### 4. Flag welcomeShown

- [ ] Implementar lógica para mostrar bienvenida solo la primera vez
- [ ] Marcar como `true` después de mostrar

### Resultado esperado

- Preferencias persisten entre sesiones
- Usuario permanece logueado
- Experiencia fluida al reabrir la app

---

## 🗄️ v0.4.0 – Persistencia Estructurada (SQLite)

**Objetivo**: Migrar notas a base de datos SQLite.

### Flujo Git

```bash
git checkout -b v0.4.0-sqlite
# ... trabajo ...
git add . && git commit -m "v0.4.0: Persistencia de notas con SQLite"
git checkout main && git merge v0.4.0-sqlite
git tag v0.4.0
git push origin main --tags
```

### Dependencias

```bash
npx expo install expo-sqlite
```

### Tareas

#### 1. Schema de base de datos

- [ ] `src/services/database/schema.ts`
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

#### 2. Inicialización de DB

- [ ] `src/services/database/db.ts` → abrir conexión, ejecutar schema
- [ ] Llamar en `_layout.tsx` al iniciar app

#### 3. Capa DAO

- [ ] `src/services/database/notesDao.ts`
  - `getAllNotes(sortBy): Promise<Note[]>`
  - `getNoteById(id): Promise<Note | null>`
  - `insertNote(note): Promise<void>`
  - `updateNote(note): Promise<void>`
  - `deleteNote(id): Promise<void>`
  - `toggleFavorite(id): Promise<void>`

#### 4. Mappers

- [ ] `src/services/database/mappers.ts`
  - `noteEntityToNote(entity): Note`
  - `noteToEntity(note): NoteEntity`

#### 5. Conectar useNotesStore con DAO

- [ ] Modificar acciones para llamar a DAO
- [ ] `loadNotes()` → cargar desde SQLite
- [ ] Manejar `isLoading` y `error`

#### 6. Estados de carga

- [ ] Mostrar skeleton/spinner mientras carga
- [ ] Mostrar error si falla la carga

### Resultado esperado

- Notas persisten en SQLite
- CRUD real contra base de datos
- Estados de carga/error manejados
- Rendimiento adecuado con índices

---

## 🌐 v0.5.0 – API + Sensores

**Objetivo**: Integrar API de citas y detector de shake.

### Flujo Git

```bash
git checkout -b v0.5.0-api-sensors
# ... trabajo ...
git add . && git commit -m "v0.5.0: API de citas y shake-to-create"
git checkout main && git merge v0.5.0-api-sensors
git tag v0.5.0
git push origin main --tags
```

### Dependencias

```bash
npm install axios
npx expo install expo-sensors expo-haptics
```

### Tareas

#### 1. Cliente API

- [ ] `src/services/api/client.ts`
  - Instancia Axios con timeout
  - Interceptores para logging/errores

#### 2. API de citas

- [ ] `src/services/api/quotesApi.ts`
  - `getRandomQuote(): Promise<{ quote: string; author: string }>`
  - Endpoint: `https://zenquotes.io/api/random`

#### 3. Hook useQuote (opcional)

- [ ] `src/hooks/useQuote.ts`
  - Estado: `quote`, `isLoading`, `error`
  - Acción: `fetchQuote()`

#### 4. API de imágenes aleatorias

- [ ] `src/services/api/imagesApi.ts`
  - `getRandomImageUrl(): string` → Lorem Picsum (`https://picsum.photos/400/200`)
  - Alternativa: Unsplash Source API

#### 5. Botón "Añadir nota desde cita"

- [ ] Añadir en Ajustes o Home
- [ ] Mostrar loading mientras carga
- [ ] Si éxito → crear nota con título=cita, body="— Autor", imageUrl=imagen aleatoria
- [ ] Si error → mostrar Toast/mensaje

#### 6. Detector de shake

- [ ] `src/services/sensors/shakeDetector.ts`
  - Lógica de detección basada en acelerómetro
  - Umbral configurable
  - Debounce para evitar múltiples disparos

#### 7. Hook useShakeDetector

- [ ] `src/hooks/useShakeDetector.ts`
  - Props: `{ enabled: boolean; onShake: () => void }`
  - Suscripción al acelerómetro
  - Dispara `onShake` + haptic feedback

#### 8. Integración en UI

- [ ] Toggle `shakeEnabled` en Ajustes
- [ ] Conectar `useShakeDetector` en Home
- [ ] Al shake → abrir modal de nueva nota + vibración

### Resultado esperado

- Crear notas desde citas de API externa
- Shake-to-create funcionando
- Feedback háptico al detectar shake
- Toggle para activar/desactivar shake

---

## 🎬 v0.5.5 – Multimedia (Imágenes y Animaciones)

**Objetivo**: Captura de imágenes y animaciones avanzadas para cubrir RA3.

### Flujo Git

```bash
git checkout -b v0.5.5-multimedia
# ... trabajo ...
git add . && git commit -m "v0.5.5: Multimedia - imágenes y animaciones"
git checkout main && git merge v0.5.5-multimedia
git tag v0.5.5
git push origin main --tags
```

### Dependencias

```bash
npx expo install expo-image-picker
```

### Tareas

#### 1. Permisos de cámara y galería

- [ ] Configurar permisos en `app.json`
  ```json
  "plugins": [
    [
      "expo-image-picker",
      {
        "photosPermission": "Permitir acceso a fotos para añadir imágenes a las notas",
        "cameraPermission": "Permitir acceso a la cámara para tomar fotos"
      }
    ]
  ]
  ```
- [ ] Hook `src/hooks/useImagePicker.ts`
  - `pickFromGallery(): Promise<string | null>`
  - `takePhoto(): Promise<string | null>`
  - Manejo de permisos y errores

#### 2. Selector de imagen en NoteForm

- [ ] Componente `src/components/notes/ImagePicker.tsx`
  - Botones: "Tomar foto" / "Elegir de galería"
  - Preview de imagen seleccionada
  - Botón para eliminar imagen
- [ ] Integrar en `NoteForm`
  - Campo opcional de imagen
  - Mostrar preview si hay imagen

#### 3. Visualización de imágenes

- [ ] Mejorar `NoteCard` con imagen
  - Usar `expo-image` con placeholder/loading
  - Manejo de errores de carga (imagen por defecto)
- [ ] Pantalla Detalle con imagen ampliada
  - Imagen a pantalla completa al pulsar
  - Gesto de zoom (opcional)

#### 4. Animaciones con Reanimated

- [ ] Animación de entrada en lista de notas
  - FadeIn + SlideIn escalonado
- [ ] Animación al añadir/eliminar nota
  - Layout animation
- [ ] Animación en toggle favorito
  - Scale + rotate del icono estrella
- [ ] Transición de imagen en detalle
  - Shared element transition (opcional)

#### 5. Feedback de acciones

- [ ] Animación de confirmación al guardar
- [ ] Animación de swipe-to-delete mejorada
- [ ] Micro-interacciones en botones

### Resultado esperado

- Captura de fotos desde cámara
- Selección de imágenes de galería
- Imágenes en notas (manuales y desde API)
- Animaciones fluidas en toda la app
- Permisos correctamente configurados

### Criterios RA3 cubiertos

| Criterio                     | Cómo se cubre                       |
| ---------------------------- | ----------------------------------- |
| b) Captura y almacenamiento  | expo-image-picker                   |
| d) Procesar datos multimedia | expo-image (resize, cache)          |
| e) Eventos y excepciones     | onLoad, onError, permisos           |
| f) Animaciones               | Reanimated en listas y transiciones |
| g) Reproducir multimedia     | Visualización de imágenes           |

---

## 🎨 v0.6.0 (Opcional) – Polish y Mejoras

**Objetivo**: Pulir UI, añadir animaciones, documentación.

### Posibles mejoras

- [ ] Animaciones con Reanimated en listas
- [ ] Transiciones de navegación personalizadas
- [ ] Splash screen personalizado
- [ ] Icono de app personalizado
- [ ] Tests unitarios básicos
- [ ] Documentación de componentes
- [ ] Rama alternativa con NativeWind

---

## 📊 Resumen de Versiones

| Versión | Rama                   | Foco Principal     | Dependencias Nuevas                     |
| ------- | ---------------------- | ------------------ | --------------------------------------- |
| v0.0.0  | `v0.0.0-base`          | Limpieza proyecto  | -                                       |
| v0.1.0  | `v0.1.0-navigation`    | Navegación + Login | -                                       |
| v0.2.0  | `v0.2.0-zustand`       | Estado global      | `zustand`                               |
| v0.3.0  | `v0.3.0-async-storage` | Persistencia prefs | `async-storage`                         |
| v0.4.0  | `v0.4.0-sqlite`        | Persistencia notas | `expo-sqlite`                           |
| v0.5.0  | `v0.5.0-api-sensors`   | API + Sensores     | `axios`, `expo-sensors`, `expo-haptics` |
| v0.5.5  | `v0.5.5-multimedia`    | Imágenes + Animac. | `expo-image-picker`                     |

---

## ⏭️ Próximo paso

**Comenzar con v0.0.0**: Limpiar el proyecto y crear la estructura base.

```bash
git checkout -b v0.0.0-base
```
