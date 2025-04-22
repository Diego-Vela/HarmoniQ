import React from 'react';
import { View, Image, Text, Dimensions } from 'react-native';
import { placeholders } from '@/constants/icons';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const ProfileHeader = () => {
  const user = {
    profilePicture: placeholders.profile,
    username: 'Placeholder',
    accountAge: 'Not Needed',
  };

  return (
    <View
      className="flex items-center justify-center self-center "
      style={{
        width: width * 0.5, // 50% of the screen width
        height: height * 0.3, // 30% of the screen height
        marginTop: height * 0.015, 
        marginBottom: height * 0.015, 
      }}
    >
      <Image
        source={user.profilePicture}
        style={{
          width: '100%',
          height: '60%',
          borderRadius: (width * 0.5) / 2, // Ensure the image remains circular
        }}
        resizeMode="contain"
      />
      {/*
      <Text
        className="text-white font-bold"
        style={{
          fontSize: width * 0.05, // 5% of the screen width
          marginTop: height * 0.02, // 2% of the screen height
        }}
      >
        {user.username}
      </Text>
      <Text
        className="text-gray-400"
        style={{
          fontSize: width * 0.035, // 3.5% of the screen width
          marginTop: height * 0.01, // 1% of the screen height
        }}
      >
        Account Age: {user.accountAge}
      </Text>*/}
    </View>
  );
};

export default ProfileHeader;