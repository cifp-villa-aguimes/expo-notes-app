import { Button, Input } from "@/src/components/ui";
import { useTheme } from "@/src/hooks";
import { Spacing, Typography } from "@/src/theme";
import type { Note, NoteFormData } from "@/src/types";
import { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

const TITLE_MAX_LENGTH = 80;

interface NoteFormProps {
  note?: Note;
  onSubmit: (data: NoteFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function NoteForm({
  note,
  onSubmit,
  onCancel,
  isLoading = false,
}: NoteFormProps) {
  const { colors } = useTheme();
  const isEditing = !!note;

  const [title, setTitle] = useState(note?.title ?? "");
  const [body, setBody] = useState(note?.body ?? "");
  const [isFavorite, setIsFavorite] = useState(note?.isFavorite ?? false);
  const [titleError, setTitleError] = useState<string | undefined>();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setBody(note.body);
      setIsFavorite(note.isFavorite);
    }
  }, [note]);

  const validateTitle = (value: string) => {
    if (value.trim().length === 0) {
      return "El título es obligatorio";
    }
    if (value.trim().length > TITLE_MAX_LENGTH) {
      return `Máximo ${TITLE_MAX_LENGTH} caracteres`;
    }
    return undefined;
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setTitleError(validateTitle(value));
  };

  const handleSubmit = () => {
    const error = validateTitle(title);
    if (error) {
      setTitleError(error);
      return;
    }

    onSubmit({
      title: title.trim(),
      body: body.trim(),
      isFavorite,
    });
  };

  const isValid = title.trim().length > 0 && !titleError;

  return (
    <View style={styles.container}>
      <Input
        label="Título"
        value={title}
        onChangeText={handleTitleChange}
        placeholder="Título de la nota"
        maxLength={TITLE_MAX_LENGTH}
        showCharCount
        error={titleError}
      />

      <Input
        label="Contenido"
        value={body}
        onChangeText={setBody}
        placeholder="Escribe tu nota aquí..."
        multiline
        numberOfLines={3}
      />

      <View style={styles.favoriteRow}>
        <Text style={[styles.favoriteLabel, { color: colors.text }]}>
          Marcar como favorito
        </Text>
        <Switch
          value={isFavorite}
          onValueChange={setIsFavorite}
          trackColor={{ false: colors.border, true: colors.primaryLight }}
          thumbColor={isFavorite ? colors.primary : colors.surface}
        />
      </View>

      <View style={styles.actions}>
        <Button
          title="Cancelar"
          onPress={onCancel}
          variant="outline"
          style={styles.actionButton}
        />
        <Button
          title={isEditing ? "Guardar" : "Crear"}
          onPress={handleSubmit}
          disabled={!isValid}
          loading={isLoading}
          style={styles.actionButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  favoriteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  favoriteLabel: {
    ...Typography.label,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
