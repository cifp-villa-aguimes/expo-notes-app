/**
 * Representa una nota en la aplicación
 */
export interface Note {
  id: string;
  title: string;
  body: string;
  isFavorite: boolean;
  imageUrl?: string;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
  createdBy: string; // nickname del usuario
}

/**
 * Datos del formulario para crear/editar nota
 */
export interface NoteFormData {
  title: string;
  body?: string;
  isFavorite?: boolean;
  imageUrl?: string;
}

/**
 * Representación de nota para SQLite
 */
export interface NoteEntity {
  id: string;
  title: string;
  body: string | null;
  is_favorite: number; // 0 o 1
  image_url: string | null;
  created_at: number;
  updated_at: number;
  created_by: string;
}
