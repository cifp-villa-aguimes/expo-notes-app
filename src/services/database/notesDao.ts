import type { Note, NoteEntity, SortBy } from "@/src/types";

import { getDatabase } from "./db";
import { noteEntityToNote, noteToEntity } from "./mappers";

/**
 * Data Access Object para operaciones con notas en SQLite
 */
export const notesDao = {
  /**
   * Obtiene todas las notas ordenadas según criterio
   */
  async getAllNotes(sortBy: SortBy = "date"): Promise<Note[]> {
    const db = getDatabase();

    let orderClause: string;
    switch (sortBy) {
      case "title":
        orderClause = "ORDER BY title COLLATE NOCASE ASC";
        break;
      case "favorites":
        orderClause = "ORDER BY is_favorite DESC, updated_at DESC";
        break;
      case "date":
      default:
        orderClause = "ORDER BY updated_at DESC";
    }

    const entities = await db.getAllAsync<NoteEntity>(
      `SELECT * FROM notes ${orderClause}`
    );

    return entities.map(noteEntityToNote);
  },

  /**
   * Obtiene una nota por su ID
   */
  async getNoteById(id: string): Promise<Note | null> {
    const db = getDatabase();

    const entity = await db.getFirstAsync<NoteEntity>(
      "SELECT * FROM notes WHERE id = ?",
      [id]
    );

    return entity ? noteEntityToNote(entity) : null;
  },

  /**
   * Inserta una nueva nota
   */
  async insertNote(note: Note): Promise<void> {
    const db = getDatabase();
    const entity = noteToEntity(note);

    await db.runAsync(
      `INSERT INTO notes (id, title, body, is_favorite, image_url, created_at, updated_at, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entity.id,
        entity.title,
        entity.body,
        entity.is_favorite,
        entity.image_url,
        entity.created_at,
        entity.updated_at,
        entity.created_by,
      ]
    );
  },

  /**
   * Actualiza una nota existente
   */
  async updateNote(note: Note): Promise<void> {
    const db = getDatabase();
    const entity = noteToEntity(note);

    await db.runAsync(
      `UPDATE notes 
       SET title = ?, body = ?, is_favorite = ?, image_url = ?, updated_at = ?
       WHERE id = ?`,
      [
        entity.title,
        entity.body,
        entity.is_favorite,
        entity.image_url,
        entity.updated_at,
        entity.id,
      ]
    );
  },

  /**
   * Elimina una nota por su ID
   */
  async deleteNote(id: string): Promise<void> {
    const db = getDatabase();

    await db.runAsync("DELETE FROM notes WHERE id = ?", [id]);
  },

  /**
   * Alterna el estado de favorito de una nota
   */
  async toggleFavorite(id: string): Promise<Note | null> {
    const db = getDatabase();
    const now = Date.now();

    // Actualizar en una sola operación
    await db.runAsync(
      `UPDATE notes 
       SET is_favorite = CASE WHEN is_favorite = 1 THEN 0 ELSE 1 END,
           updated_at = ?
       WHERE id = ?`,
      [now, id]
    );

    // Retornar la nota actualizada
    return this.getNoteById(id);
  },

  /**
   * Obtiene solo las notas favoritas
   */
  async getFavoriteNotes(): Promise<Note[]> {
    const db = getDatabase();

    const entities = await db.getAllAsync<NoteEntity>(
      "SELECT * FROM notes WHERE is_favorite = 1 ORDER BY updated_at DESC"
    );

    return entities.map(noteEntityToNote);
  },

  /**
   * Cuenta el total de notas
   */
  async getNotesCount(): Promise<number> {
    const db = getDatabase();

    const result = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM notes"
    );

    return result?.count ?? 0;
  },
};
