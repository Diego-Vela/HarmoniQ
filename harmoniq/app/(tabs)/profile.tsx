import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Topbar from '@/components/topbar';
import { images } from '@/constants/images';
import { placeholders } from '@/constants/icons';

const Profile = () => {
  // Mock user data
  const user = {
    profilePicture: placeholders.profile, // Corrected to use the actual value
    username: 'JohnDoe123',
    accountAge: '2 years', // Replace with dynamic calculation if needed
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-300">
      {/* Topbar */}
      <View className="flex justify-center items-center w-full h-[8%] mt-0 bg-primary z-0 border-gray-600 border-b">
        <Topbar />
      </View>

      {/* Profile Content */}
      <View className="flex-1">
        {/* Background Image */}
        <Image
          source={images.bg}
          className="absolute w-full h-[50%] z-0"
          resizeMode="cover"
        />

        {/* Profile Details */}
        <ScrollView
          className="flex-1"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ minHeight: '100%', paddingBottom: 20 }}
        >
          <View className="flex items-center justify-center mt-10">
            {/* User Picture */}
            <Image
              source={user.profilePicture} // Correctly referencing the profile picture
              className="w-32 h-32 rounded-full border-4 border-white"
              resizeMode="cover"
            />

            {/* Username */}
            <Text className="text-white text-2xl font-bold mt-4">
              {user.username}
            </Text>

            {/* Account Age */}
            <Text className="text-gray-400 text-lg mt-2">
              Account Age: {user.accountAge}
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({});