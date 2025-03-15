import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

type SimpleNotesProps = {
  notes: string[]; // Full notes like "c4", "d4", etc.
  selectedNote: string | null;
  onNotePress: (note: string) => void; // Function to handle note press
  disabled: boolean; // New prop to disable buttons
};

const SimpleNotes: React.FC<SimpleNotesProps> = ({ notes, selectedNote, onNotePress, disabled }) => {
  return (
    <View className="flex-wrap flex-row w-[100%] h-[70%] bg-transparent items-center justify-evenly">
      {notes.map(note => {
        const isSelected = selectedNote === note;

        // Extract the uppercase letter of the note (e.g., "C" from "c4")
        const displayNote = note.charAt(0).toUpperCase();

        return (
          <TouchableOpacity
            key={note}
            className={`w-[45%] h-[45%] rounded-3xl items-center justify-center mt-[1%] mb-[1%] ${
              disabled
                ? 'bg-gray-500' // Darker gray when disabled
                : isSelected
                ? 'bg-blue-500' // Highlighted when selected
                : 'bg-gray-300' // Default background color
            }`}
            onPress={() => onNotePress(note)}
            disabled={disabled} // Disable button when `disabled` is true
          >
            <Text
              className={`text-center text-3xl font-bold ${
                disabled ? 'text-gray-400' : 'text-black'
              }`} // Change text color when disabled
            >
              {displayNote}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default SimpleNotes;

const styles = StyleSheet.create({});