import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'
import { icons } from "@/constants/icons";

const id = 'note-reading';

const Lesson = () => {
  return (
    <Link href={`../(lessons)/${id}/level1`} asChild>
      <TouchableOpacity className="w-[40%] mt-10" >
        <Image
          source={icons.lesson}
          tintColor='yellow'
          className="w-full h-32 rounded-lg"
          resizeMode="contain"       
        />
      </TouchableOpacity>
    </Link>
  )
}

export default Lesson

const styles = StyleSheet.create({})