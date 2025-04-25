import React, { useState, useEffect, useRef } from 'react';
import { View, Text, PanResponder, Animated, LayoutRectangle, TouchableOpacity, Dimensions } from 'react-native';
import ActivityBase from '@/components/activities/common/activity-base';
import Feedback from '@/components/activities/common/feedback';
import { generateIntervalRound } from '@/utils/drag-interval-utils';
import { Ionicons } from '@expo/vector-icons';

const DragInterval = () => {
  const [round, setRound] = useState(generateIntervalRound());
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // Track dragging state
  const [dragX] = useState(new Animated.Value(0)); // Horizontal drag value
  const [dragY] = useState(new Animated.Value(0)); // Vertical drag value
  const dragSectionBounds = useRef<LayoutRectangle | null>(null); // Bounds of the drag section

  const leftZone = useRef<LayoutRectangle | null>(null);
  const rightZone = useRef<LayoutRectangle | null>(null);
  const noteRef = useRef<View>(null);

  const currentDragX = useRef(0);
  const currentDragY = useRef(0);
  const screenWidth = Dimensions.get('window').width; // Get the screen width

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsDragging(true); // Set dragging state to true when dragging starts
    },
    onPanResponderMove: (_, gestureState) => {
      dragX.setValue(gestureState.dx);
      dragY.setValue(gestureState.dy);

      currentDragX.current = gestureState.dx;
      currentDragY.current = gestureState.dy;

      if (dragSectionBounds.current) {
        const maxDragY = dragSectionBounds.current.height / 2;

        const clampedY = Math.max(-maxDragY, Math.min(gestureState.dy, maxDragY));
        dragY.setValue(clampedY);
      } else {
        dragY.setValue(gestureState.dy); // fallback
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      setIsDragging(false); // Set dragging state to false when dragging ends

      // Calculate the draggable note's absolute position
      const noteLeft = currentDragX.current + screenWidth / 2 - 25; // Adjust for note's width (assuming 50px width)
      const noteRight = noteLeft + 50; // Assuming the note's width is 50

      // Ensure leftZone and rightZone are initialized
      if (!leftZone.current || !rightZone.current) {
        console.error('Left or Right zone is not initialized');
        return;
      }

      // Calculate the left and right zone bounds
      const leftZoneRight = leftZone.current.x + leftZone.current.width; // Left zone ends at its width
      const rightZoneLeft = screenWidth - rightZone.current.width; // Right zone starts at screenWidth - its width

      console.log('[DEBUG] Left Zone:', { leftZoneRight });
      console.log('[DEBUG] Right Zone:', { rightZoneLeft });

      // Check for overlap
      const leftZoneOverlap = noteRight > 0 && noteLeft < leftZoneRight;
      const rightZoneOverlap = noteRight > rightZoneLeft && noteLeft < screenWidth;

      console.log('[DEBUG] Note:', { noteLeft, noteRight });
      console.log('[DEBUG] Left Zone:', { leftZoneRight });
      console.log('[DEBUG] Right Zone:', { rightZoneLeft });

      const direction = leftZoneOverlap ? 'left' : rightZoneOverlap ? 'right' : null;
      console.log('[DEBUG] Direction:', direction);

      if (!direction) {
        // Animate the note back to center if no overlap
        Animated.spring(dragX, {
          toValue: 0,
          useNativeDriver: true,
        }).start(() => dragX.setValue(0)); // force reset value after animation

        Animated.spring(dragY, {
          toValue: 0,
          useNativeDriver: true,
        }).start(() => dragY.setValue(0)); // same here

        return;
      }

      // ✅ Proceed only if there's valid overlap
      const correct =
        (round.isHigher && direction === 'right') ||
        (!round.isHigher && direction === 'left');

      setIsCorrect(correct);
      setFeedbackVisible(true);

      setTimeout(() => {
        setRound(generateIntervalRound());
        setFeedbackVisible(false);
        dragX.setValue(0);
        dragY.setValue(0); // Reset vertical position
      }, 500);
    },
  });

  useEffect(() => {
    console.log('Play root note:', round.rootNote);
    setTimeout(() => console.log('Play comparison note:', round.comparisonNote), 600);
  }, [round]);

  return (
    <ActivityBase description="Drag the notes to the correct zone based on pitch.">
      {/* Header Section */}
      <View className="flex items-center justify-evenly w-[80%] h-[35%] bg-transparent">
        <Text className="text-white font-bold text-4xl">
          Root Note: {round.rootNote.toUpperCase()}
        </Text>
        <TouchableOpacity
          className="flex items-center justify-center w-[20%] h-[22%] bg-accent border border-primary rounded-full shadow-lg"
          onPress={() => console.log('Play root note:', round.rootNote)}
        >
          <Text className="text-white text-3xl">🔊</Text>
        </TouchableOpacity>
      </View>

      {/* Drag Section */}
      <View
        className="flex items-center justify-evenly gap-4 w-full bg-transparent h-[50%]"
        onLayout={(e) => (dragSectionBounds.current = e.nativeEvent.layout)} // Capture drag section bounds
      >
        <View className="w-full h-full flex-row justify-between items-center">
          {/* Left Marker */}
          <View
            onLayout={(e) => (leftZone.current = e.nativeEvent.layout)}
            className="w-20 h-full bg-blue-700 opacity-70 flex items-center justify-center"
          >
            {/* "Lower" Text */}
            <Text
              className="text-white font-bold text-2xl w-full text-center"
              style={{ transform: [{ rotate: '90deg' }] }} // Rotate text vertically
            >
              Lower
            </Text>
          </View>

          {/* Draggable Note */}
          <Animated.View
            ref={noteRef}
            {...panResponder.panHandlers}
            onLayout={(e) => {
              const { x, y, width, height } = e.nativeEvent.layout;
              console.log('Note position on load:', { x, y, width, height });
            }}
            onStartShouldSetResponder={() => {
              console.log('Comparison Note:', round.comparisonNote);
              return false; // Allow PanResponder to handle the gesture
            }}
            style={{
              transform: [{ translateX: dragX }, { translateY: dragY }], // Allow both horizontal and vertical dragging
              backgroundColor: isDragging ? '#3b82f6' : 'white', // Change background color while dragging
              padding: 16,
              borderRadius: 8,
            }}
          >
            <Ionicons name="musical-notes" size={32} color="black" />
          </Animated.View>

          {/* Right Marker */}
          <View
            onLayout={(e) => (rightZone.current = e.nativeEvent.layout)}
            className="w-20 h-full bg-red-700 opacity-70 flex items-center justify-center"
          >
            {/* "Higher" Text */}
            <Text
              className="text-white font-bold text-2xl w-full text-center"
              style={{ transform: [{ rotate: '-90deg' }] }} // Rotate text vertically
            >
              Higher
            </Text>
          </View>
        </View>

        <Feedback isCorrect={!!isCorrect} visible={feedbackVisible} />
      </View>
    </ActivityBase>
  );
};

export default DragInterval;
