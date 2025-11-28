import type { Note } from "@/src/types";
import { useEffect } from "react";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

import { NoteCard } from "./NoteCard";

interface AnimatedNoteCardProps {
  note: Note;
  index: number;
  onPress: () => void;
  onFavoritePress?: () => void;
}

/**
 * NoteCard con animaciones de entrada escalonadas
 * y animación al marcar/desmarcar favorito
 */
export function AnimatedNoteCard({
  note,
  index,
  onPress,
  onFavoritePress,
}: AnimatedNoteCardProps) {
  const scale = useSharedValue(1);
  const prevIsFavorite = useSharedValue(note.isFavorite);

  // Animación cuando cambia isFavorite
  useEffect(() => {
    if (note.isFavorite !== prevIsFavorite.value) {
      scale.value = withSequence(
        withSpring(1.05, { damping: 10, stiffness: 400 }),
        withSpring(1, { damping: 10, stiffness: 400 })
      );
      prevIsFavorite.value = note.isFavorite;
    }
  }, [note.isFavorite, scale, prevIsFavorite]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50)
        .duration(300)
        .springify()
        .damping(15)}
      style={animatedStyle}
    >
      <NoteCard
        note={note}
        onPress={onPress}
        onFavoritePress={onFavoritePress}
      />
    </Animated.View>
  );
}
