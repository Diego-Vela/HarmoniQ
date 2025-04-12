import { Text, View, Image, ScrollView } from "react-native";
import React from "react";
import Background from "@/components/common/background";
import { images } from "@/constants/images";
import { placeholders } from "@/constants/icons";

const Profile = () => {
  // Mock user data
  const user = {
    profilePicture: placeholders.profile,
    username: "JohnDoe123",
    accountAge: "2 years",
  };

  return (
    <Background>
      {/* Background Image */}
      <Image source={images.bg} className="absolute w-full h-[50%] z-0" resizeMode="cover" />

      {/* Profile Details */}
      <ScrollView className="flex-1" showsHorizontalScrollIndicator={false} contentContainerStyle={{ minHeight: "100%", paddingBottom: 100 }}>
        <View className="flex items-center justify-center mt-10">
          {/* User Picture */}
          <Image source={user.profilePicture} className="w-32 h-32 rounded-full border-4 border-white" resizeMode="cover" />

          {/* Username */}
          <Text className="text-white text-2xl font-bold mt-4">{user.username}</Text>

          {/* Account Age */}
          <Text className="text-gray-400 text-lg mt-2">Account Age: {user.accountAge}</Text>
        </View>
      </ScrollView>
    </Background>
  );
};

export default Profile;