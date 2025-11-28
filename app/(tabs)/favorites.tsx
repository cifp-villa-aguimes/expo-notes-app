import { SwipeableNoteCard } from "@/src/components/notes";
import { EmptyState } from "@/src/components/ui";
import { useTheme } from "@/src/hooks";
import { useNotesStore } from "@/src/stores";
import { Spacing } from "@/src/theme";
import type { Note } from "@/src/types";
import { router } from "expo-router";
import { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function FavoritesScreen() {
  const { colors } = useTheme();

  // Suscribirse a notes directamente para reactividad
  const allNotes = useNotesStore((s) => s.notes);
  const { deleteNote, toggleFavorite } = useNotesStore();

  // Filtrar favoritos (se recalcula cuando allNotes cambia)
  const favorites = allNotes
    .filter((note) => note.isFavorite)
    .sort((a, b) => b.updatedAt - a.updatedAt);

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
        {favorites.length === 0 ? (
          <EmptyState
            emoji="⭐"
            title="No hay favoritos"
            message="Marca notas como favoritas para verlas aquí"
          />
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
});
