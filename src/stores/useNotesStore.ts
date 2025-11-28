import type { Note, NoteFormData, SortBy } from "@/src/types";
import { create } from "zustand";

interface NotesState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addNote: (formData: NoteFormData, userName: string) => void;
  updateNote: (id: string, formData: Partial<NoteFormData>) => void;
  deleteNote: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearError: () => void;

  // Selectors
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

  addNote: (formData, userName) => {
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

    set((state) => ({
      notes: [newNote, ...state.notes],
    }));
  },

  updateNote: (id, formData) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id
          ? {
              ...note,
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
            }
          : note
      ),
    }));
  },

  deleteNote: (id) => {
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    }));
  },

  toggleFavorite: (id) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id
          ? { ...note, isFavorite: !note.isFavorite, updatedAt: Date.now() }
          : note
      ),
    }));
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
