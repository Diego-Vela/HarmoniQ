import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const currentChapter = 'Chapter 1' 
const currentTopic = 'Introduction to Notation'

const Chapter = () => {
  return (
    <View className="flex-row w-[85%] h-20 mt-4 bg-blue-200 opacity-60 rounded-3xl justify-between items-center">
      {/* Current Chapter */}
      <View className="flex justify-center bg-transparent border-r w-[35%] h-20 text-center">
        <Text className="text-auto font-bold font-mono text-black text-center">{currentChapter}</Text>
      </View>
      {/* Current Topic */}
      <View className="flex justify-center bg-transparent w-[65%] h-20 text-center">
        <Text className="text-auto font-bold font-mono text-black text-center">{currentTopic}</Text>
      </View>
    </View>
  )
}

export default Chapter

const styles = StyleSheet.create({})