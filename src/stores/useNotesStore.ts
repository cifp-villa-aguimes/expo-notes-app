import { notesDao } from "@/src/services/database";
import type { Note, NoteFormData, SortBy } from "@/src/types";
import { create } from "zustand";

interface NotesState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;

  // Async Actions (SQLite)
  loadNotes: (sortBy?: SortBy) => Promise<void>;
  addNote: (formData: NoteFormData, userName: string) => Promise<void>;
  updateNote: (id: string, formData: Partial<NoteFormData>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  clearError: () => void;

  // Selectors (memoria local)
  getNoteById: (id: string) => Note | undefined;
  getSortedNotes: (sortBy: SortBy) => Note[];
  getFavoriteNotes: () => Note[];
}

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  isLoading: false,
  error: null,

  loadNotes: async (sortBy = "date") => {
    set({ isLoading: true, error: null });
    try {
      const notes = await notesDao.getAllNotes(sortBy);
      set({ notes, isLoading: false });
    } catch (error) {
      console.error("[NotesStore] Error loading notes:", error);
      set({
        error: "Error al cargar las notas",
        isLoading: false,
      });
    }
  },

  addNote: async (formData, userName) => {
    const now = Date.now();
    const newNote: Note = {
      id: generateId(),
      title: formData.title.trim(),
      body: formData.body?.trim() ?? "",
      isFavorite: formData.isFavorite ?? false,
      imageUrl: formData.imageUrl,
      createdAt: now,
      updatedAt: now,
      createdBy: userName,
    };

    try {
      await notesDao.insertNote(newNote);
      // Añadir a memoria local también
      set((state) => ({
        notes: [newNote, ...state.notes],
      }));
    } catch (error) {
      console.error("[NotesStore] Error adding note:", error);
      set({ error: "Error al crear la nota" });
    }
  },

  updateNote: async (id, formData) => {
    const currentNote = get().notes.find((n) => n.id === id);
    if (!currentNote) return;

    const updatedNote: Note = {
      ...currentNote,
      ...(formData.title !== undefined && {
        title: formData.title.trim(),
      }),
      ...(formData.body !== undefined && {
        body: formData.body.trim(),
      }),
      ...(formData.isFavorite !== undefined && {
        isFavorite: formData.isFavorite,
      }),
      ...(formData.imageUrl !== undefined && {
        imageUrl: formData.imageUrl,
      }),
      updatedAt: Date.now(),
    };

    try {
      await notesDao.updateNote(updatedNote);
      set((state) => ({
        notes: state.notes.map((note) => (note.id === id ? updatedNote : note)),
      }));
    } catch (error) {
      console.error("[NotesStore] Error updating note:", error);
      set({ error: "Error al actualizar la nota" });
    }
  },

  deleteNote: async (id) => {
    try {
      await notesDao.deleteNote(id);
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
      }));
    } catch (error) {
      console.error("[NotesStore] Error deleting note:", error);
      set({ error: "Error al eliminar la nota" });
    }
  },

  toggleFavorite: async (id) => {
    try {
      const updatedNote = await notesDao.toggleFavorite(id);
      if (updatedNote) {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? updatedNote : note
          ),
        }));
      }
    } catch (error) {
      console.error("[NotesStore] Error toggling favorite:", error);
      set({ error: "Error al cambiar favorito" });
    }
  },

  clearError: () => set({ error: null }),

  getNoteById: (id) => {
    return get().notes.find((note) => note.id === id);
  },

  getSortedNotes: (sortBy) => {
    const notes = [...get().notes];

    switch (sortBy) {
      case "title":
        return notes.sort((a, b) => a.title.localeCompare(b.title));
      case "favorites":
        return notes.sort((a, b) => {
          if (a.isFavorite === b.isFavorite) {
            return b.updatedAt - a.updatedAt;
          }
          return a.isFavorite ? -1 : 1;
        });
      case "date":
      default:
        return notes.sort((a, b) => b.updatedAt - a.updatedAt);
    }
  },

  getFavoriteNotes: () => {
    return get()
      .notes.filter((note) => note.isFavorite)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  },
}));
