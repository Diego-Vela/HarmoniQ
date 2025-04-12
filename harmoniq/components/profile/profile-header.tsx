import React from 'react';
import { View, Image, Text } from 'react-native';
import { placeholders } from '@/constants/icons';

const ProfileHeader = () => {
  const user = {
    profilePicture: placeholders.profile,
    username: 'JohnDoe123',
    accountAge: '2 years',
  };

  return (
    <View className="items-center justify-center mt-10 mb-7">
      <Image
        source={user.profilePicture}
        className="w-32 h-32 rounded-full border-4 border-white"
        resizeMode="cover"
      />
      <Text className="text-white text-2xl font-bold mt-4">{user.username}</Text>
      <Text className="text-gray-400 text-base mt-1">Account Age: {user.accountAge}</Text>
    </View>
  );
};

export default ProfileHeader;