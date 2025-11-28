import { NoteForm, SwipeableNoteCard } from "@/src/components/notes";
import { BottomSheet, EmptyState, FAB } from "@/src/components/ui";
import { useTheme } from "@/src/hooks";
import { useNotesStore, useSettingsStore, useUserStore } from "@/src/stores";
import { Spacing, Typography } from "@/src/theme";
import type { Note, NoteFormData } from "@/src/types";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function HomeScreen() {
  const { colors } = useTheme();

  const userName = useUserStore((s) => s.name);
  const sortBy = useSettingsStore((s) => s.sortBy);

  // Suscribirse a notes directamente para que re-renderice
  const allNotes = useNotesStore((s) => s.notes);
  const { addNote, deleteNote, toggleFavorite } = useNotesStore();

  // Calcular notas ordenadas (se recalcula cuando allNotes cambia)
  const notes = [...allNotes].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "favorites":
        if (a.isFavorite === b.isFavorite) {
          return b.updatedAt - a.updatedAt;
        }
        return a.isFavorite ? -1 : 1;
      case "date":
      default:
        return b.updatedAt - a.updatedAt;
    }
  });

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const openForm = useCallback(() => {
    setFormKey((k) => k + 1); // Fuerza remount del formulario
    setIsFormVisible(true);
  }, []);

  const handleAddNote = useCallback(
    (formData: NoteFormData) => {
      addNote(formData, userName);
      setIsFormVisible(false);
    },
    [addNote, userName]
  );

  const handleNotePress = useCallback((note: Note) => {
    router.push(`/note/${note.id}`);
  }, []);

  const handleDeleteNote = useCallback(
    (id: string) => {
      deleteNote(id);
    },
    [deleteNote]
  );

  const handleToggleFavorite = useCallback(
    (id: string) => {
      toggleFavorite(id);
    },
    [toggleFavorite]
  );

  const renderItem = useCallback(
    ({ item }: { item: Note }) => (
      <SwipeableNoteCard
        note={item}
        onPress={() => handleNotePress(item)}
        onFavoritePress={() => handleToggleFavorite(item.id)}
        onDelete={() => handleDeleteNote(item.id)}
      />
    ),
    [handleNotePress, handleToggleFavorite, handleDeleteNote]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {userName && (
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              Hola, <Text style={{ color: colors.primary }}>{userName}</Text>
            </Text>
            <Text style={[styles.noteCount, { color: colors.textTertiary }]}>
              {notes.length} {notes.length === 1 ? "nota" : "notas"}
            </Text>
          </View>
        )}

        {notes.length === 0 ? (
          <EmptyState
            emoji="📝"
            title="No hay notas"
            message="Pulsa el botón + para crear tu primera nota"
          />
        ) : (
          <FlatList
            data={notes}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}

        <FAB onPress={openForm} />

        <BottomSheet
          visible={isFormVisible}
          onClose={() => setIsFormVisible(false)}
        >
          <Text style={[styles.sheetTitle, { color: colors.text }]}>
            Nueva nota
          </Text>
          <NoteForm
            key={formKey}
            onSubmit={handleAddNote}
            onCancel={() => setIsFormVisible(false)}
          />
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  greeting: {
    ...Typography.body,
  },
  noteCount: {
    ...Typography.caption,
  },
  list: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  sheetTitle: {
    ...Typography.h3,
    marginBottom: Spacing.lg,
  },
});
