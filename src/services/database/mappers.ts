import type { Note, NoteEntity } from "@/src/types";

/**
 * Convierte una entidad de SQLite a modelo Note
 */
export function noteEntityToNote(entity: NoteEntity): Note {
  return {
    id: entity.id,
    title: entity.title,
    body: entity.body ?? "",
    isFavorite: entity.is_favorite === 1,
    imageUrl: entity.image_url ?? undefined,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
    createdBy: entity.created_by,
  };
}

/**
 * Convierte un modelo Note a entidad para SQLite
 */
export function noteToEntity(note: Note): NoteEntity {
  return {
    id: note.id,
    title: note.title,
    body: note.body || null,
    is_favorite: note.isFavorite ? 1 : 0,
    image_url: note.imageUrl ?? null,
    created_at: note.createdAt,
    updated_at: note.updatedAt,
    created_by: note.createdBy,
  };
}
