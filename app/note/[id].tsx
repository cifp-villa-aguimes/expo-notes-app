import { NoteForm } from "@/src/components/notes";
import { BottomSheet, Button, Card } from "@/src/components/ui";
import { useTheme } from "@/src/hooks";
import { useNotesStore } from "@/src/stores";
import { Spacing, Typography } from "@/src/theme";
import type { NoteFormData } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useLayoutEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const navigation = useNavigation();

  // Suscribirse a notes directamente para reactividad
  const allNotes = useNotesStore((s) => s.notes);
  const { updateNote, deleteNote, toggleFavorite } = useNotesStore();

  // Buscar nota (se recalcula cuando allNotes cambia)
  const note = allNotes.find((n) => n.id === id);

  const [isEditVisible, setIsEditVisible] = useState(false);

  // Configurar header con título y botón de favorito
  useLayoutEffect(() => {
    navigation.setOptions({
      title: note?.title ?? "Nota",
      headerRight: note
        ? () => (
            <TouchableOpacity
              onPress={() => toggleFavorite(note.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={note.isFavorite ? "star" : "star-outline"}
                size={24}
                color={note.isFavorite ? colors.favorite : colors.icon}
              />
            </TouchableOpacity>
          )
        : undefined,
    });
  }, [navigation, note, colors, toggleFavorite]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleUpdate = useCallback(
    (formData: NoteFormData) => {
      if (!note) return;
      updateNote(note.id, formData);
      setIsEditVisible(false);
    },
    [note, updateNote]
  );

  const handleDelete = useCallback(() => {
    if (!note) return;

    Alert.alert(
      "Eliminar nota",
      "¿Estás seguro de que quieres eliminar esta nota?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            deleteNote(note.id);
            router.back();
          },
        },
      ]
    );
  }, [note, deleteNote]);

  if (!note) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundEmoji}>🔍</Text>
          <Text style={[styles.notFoundText, { color: colors.text }]}>
            Nota no encontrada
          </Text>
          <Button title="Volver" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {note.imageUrl && (
          <Image
            source={{ uri: note.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <Card style={styles.card}>
          <Text style={[styles.title, { color: colors.text }]}>
            {note.title}
          </Text>

          {note.body.length > 0 && (
            <Text style={[styles.body, { color: colors.textSecondary }]}>
              {note.body}
            </Text>
          )}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.meta}>
            <View style={styles.metaRow}>
              <Ionicons name="person-outline" size={16} color={colors.icon} />
              <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                {note.createdBy}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={16} color={colors.icon} />
              <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                Creada: {formatDate(note.createdAt)}
              </Text>
            </View>

            {note.updatedAt !== note.createdAt && (
              <View style={styles.metaRow}>
                <Ionicons name="create-outline" size={16} color={colors.icon} />
                <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                  Editada: {formatDate(note.updatedAt)}
                </Text>
              </View>
            )}
          </View>
        </Card>

        <View style={styles.actions}>
          <Button
            title="Editar"
            onPress={() => setIsEditVisible(true)}
            variant="secondary"
            style={styles.actionButton}
          />
          <Button
            title="Eliminar"
            onPress={handleDelete}
            variant="outline"
            style={{ ...styles.actionButton, borderColor: colors.error }}
            textStyle={{ color: colors.error }}
          />
        </View>
      </ScrollView>

      <BottomSheet
        visible={isEditVisible}
        onClose={() => setIsEditVisible(false)}
      >
        <Text style={[styles.sheetTitle, { color: colors.text }]}>
          Editar nota
        </Text>
        <NoteForm
          note={note}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditVisible(false)}
        />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: Spacing.lg,
  },
  card: {
    gap: Spacing.md,
  },
  title: {
    ...Typography.h2,
  },
  body: {
    ...Typography.body,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  meta: {
    gap: Spacing.sm,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  metaText: {
    ...Typography.caption,
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.lg,
  },
  notFoundEmoji: {
    fontSize: 64,
  },
  notFoundText: {
    ...Typography.h3,
  },
  sheetTitle: {
    ...Typography.h3,
    marginBottom: Spacing.lg,
  },
});
