import { Card } from "@/src/components/ui";
import { useTheme } from "@/src/hooks";
import { Spacing, Typography } from "@/src/theme";
import type { Note } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onFavoritePress?: () => void;
}

export function NoteCard({ note, onPress, onFavoritePress }: NoteCardProps) {
  const { colors } = useTheme();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const bodyPreview =
    note.body.length > 100 ? `${note.body.substring(0, 100)}...` : note.body;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        {note.imageUrl && (
          <Image
            source={{ uri: note.imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={200}
            placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
          />
        )}

        <View style={styles.content}>
          <View style={styles.header}>
            <Text
              style={[styles.title, { color: colors.text }]}
              numberOfLines={1}
            >
              {note.title}
            </Text>

            <TouchableOpacity
              onPress={onFavoritePress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={note.isFavorite ? "star" : "star-outline"}
                size={20}
                color={note.isFavorite ? colors.favorite : colors.icon}
              />
            </TouchableOpacity>
          </View>

          {bodyPreview.length > 0 && (
            <Text
              style={[styles.body, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {bodyPreview}
            </Text>
          )}

          <View style={styles.footer}>
            <Text style={[styles.date, { color: colors.textTertiary }]}>
              {formatDate(note.updatedAt)}
            </Text>
            <Text style={[styles.author, { color: colors.textTertiary }]}>
              {note.createdBy}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 120,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.sm,
  },
  title: {
    ...Typography.h3,
    flex: 1,
  },
  body: {
    ...Typography.bodySmall,
    marginTop: Spacing.sm,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.md,
  },
  date: {
    ...Typography.caption,
  },
  author: {
    ...Typography.caption,
  },
});
