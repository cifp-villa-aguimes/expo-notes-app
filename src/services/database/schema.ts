/**
 * Schema de base de datos SQLite para la app de notas
 */

export const DATABASE_NAME = "notes.db";

export const DATABASE_VERSION = 1;

/**
 * SQL para crear la tabla de notas
 */
export const CREATE_NOTES_TABLE = `
  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT,
    is_favorite INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    created_by TEXT NOT NULL
  );
`;

/**
 * Índice para ordenar por fecha de actualización (más recientes primero)
 */
export const CREATE_INDEX_UPDATED_AT = `
  CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);
`;

/**
 * Índice para filtrar favoritos rápidamente
 */
export const CREATE_INDEX_FAVORITE = `
  CREATE INDEX IF NOT EXISTS idx_notes_is_favorite ON notes(is_favorite);
`;

/**
 * Todas las sentencias de inicialización en orden
 */
export const INIT_STATEMENTS = [
  CREATE_NOTES_TABLE,
  CREATE_INDEX_UPDATED_AT,
  CREATE_INDEX_FAVORITE,
];
