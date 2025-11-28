import { useTheme } from "@/src/hooks";
import { Spacing } from "@/src/theme";
import type { Note } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { Animated, StyleSheet, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { NoteCard } from "./NoteCard";

interface SwipeableNoteCardProps {
  note: Note;
  onPress: () => void;
  onFavoritePress?: () => void;
  onDelete: () => void;
}

export function SwipeableNoteCard({
  note,
  onPress,
  onFavoritePress,
  onDelete,
}: SwipeableNoteCardProps) {
  const { colors } = useTheme();

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.5],
      extrapolate: "clamp",
    });

    return (
      <View style={[styles.deleteAction, { backgroundColor: colors.error }]}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      onSwipeableOpen={(direction) => {
        if (direction === "right") {
          onDelete();
        }
      }}
      rightThreshold={100}
    >
      <NoteCard
        note={note}
        onPress={onPress}
        onFavoritePress={onFavoritePress}
      />
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  deleteAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    marginVertical: Spacing.xs,
    borderRadius: 12,
    marginLeft: Spacing.sm,
  },
});
