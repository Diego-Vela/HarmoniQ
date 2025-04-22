import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

type SimpleNotesProps = {
  notes: string[];
  selectedNote: string | null;
  correctNote: string | null;
  onNotePress: (note: string) => void;
  disabled: boolean;
  showFeedback: boolean;
  isAnswerCorrect: boolean | null;
};

const SimpleNotes: React.FC<SimpleNotesProps> = ({
  notes,
  selectedNote,
  correctNote,
  onNotePress,
  disabled,
  showFeedback,
}) => {
  const displayNoteName = (note: string): string => {
    const base = note.toLowerCase();
  
    const pitch = base[0].toUpperCase();
    const isSharp = base.includes("sharp");
    const isFlat = base.includes("flat");
    const isMajor = base.includes("major");
    const isMinor = base.includes("minor");
  
    let displayName = pitch;
  
    if (isSharp) displayName += "♯";
    if (isFlat) displayName += "♭";
    if (isMajor) displayName += " Major";
    if (isMinor) displayName += " minor";
  
    return displayName;
  };

  return (
    <View className="flex-wrap flex-row w-[95%] h-[60%] justify-evenly items-center">
      {notes.map((note) => {
        const isSelected = selectedNote === note;
        const isCorrect = correctNote === note;
        const isWrong = showFeedback && isSelected && !isCorrect;

        // Visual logic overrides default disabled color
        let bgColor = 'bg-gray-300';
        if (showFeedback && isCorrect) {
          bgColor = 'bg-green-500';
        } else if (showFeedback && isWrong) {
          bgColor = 'bg-red-500';
        } else if (isSelected) {
          bgColor = 'bg-blue-500';
        } else if (disabled && !showFeedback) {
          bgColor = 'bg-gray-700'; // Default disabled gray
        }

        let textColor = 'text-black';
        if ((disabled && !showFeedback) || (showFeedback && !isCorrect && !isWrong)) {
          textColor = 'text-gray-400';
          bgColor = 'bg-gray-500'; // Default disabled gray
        }

        return (
          <TouchableOpacity
            key={note}
            className={`w-[45%] h-[45%] rounded-3xl justify-center mt-[2%] mb-[2%] ${bgColor}`}
            onPress={() => onNotePress(note)}
            disabled={disabled || showFeedback}
          >
            <Text className={`text-center text-3xl font-bold ${textColor}`}>
              {displayNoteName(note)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default SimpleNotes;

const styles = StyleSheet.create({});
