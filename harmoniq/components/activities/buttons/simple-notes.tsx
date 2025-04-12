import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

type SimpleNotesProps = {
  notes: string[]; // Full notes like "C#", "Db", etc.
  selectedNote: string | null;
  onNotePress: (note: string) => void; // Function to handle note press
  disabled: boolean; // New prop to disable buttons
};

const SimpleNotes: React.FC<SimpleNotesProps> = ({ notes, selectedNote, onNotePress, disabled }) => {
  return (
    <View className="flex-wrap flex-row w-[95%] h-[60%] justify-evenly items-center">
      {notes.map(note => {
        const isSelected = selectedNote === note;

        // Extract the note up to the sharp (#) or flat (b) symbol
        const displayNote = note
        .match(/^[A-G][#b]?/)?.[0] || note.charAt(0).toUpperCase()
        .replace('#', '♯')
        .replace('b', '♭');

        return (
          <TouchableOpacity
            key={note}
            className={`w-[45%] h-[45%] rounded-3xl justify-center mt-[2%] mb-[2%] ${
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