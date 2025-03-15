import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

type AllNotesProps = {
  notes: string[];
  selectedNote: string | null;
  setSelectedNote: (note: string | null) => void;
};

const AllNotes: React.FC<AllNotesProps> = ({ notes, selectedNote, setSelectedNote }) => {
  return (
    <View className="flex-wrap flex-row w-[90%] h-[35%] bg-white items-start justify-evenly">
      {notes.map(note => (
        <TouchableOpacity
          key={note}
          className={`w-[30%] h-[30%] rounded-xl items-center justify-center mt-[1%] mb-[1%] ${
            selectedNote === note ? 'bg-blue-500' : 'bg-gray-300'
          }`}
          onPress={() => setSelectedNote(selectedNote === note ? null : note)}
        >
          <Text className="text-center font-bold">{note}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default AllNotes;

const styles = StyleSheet.create({});