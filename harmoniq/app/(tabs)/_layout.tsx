import { View, Text, ImageBackground, Image } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { RFValue } from 'react-native-responsive-fontsize';
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

{/* Function for the navigation tabs */}
const TabIcon = ({ focused, icon, title }: { focused: boolean, icon: any, title: string }) => {
  if (focused) {
    return (
      <ImageBackground
        source={images.highlight}
        className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
      >
        <Image
          source={icon}
          tintColor="#00244E"
          className="size-7"
          resizeMode="contain"
        />
        <Text
          style={{ fontSize: RFValue(11) }} // Adjust the value as needed
          className="text-primary font-semibold ml-2"
        >
          {title}
        </Text>
      </ImageBackground>
    );
  } else {
    return (
      <View className="size-full justify-center items-center mt-4 rounded-full overflow-hidden">
        <Image
          source={icon}
          tintColor="#FF7900"
          className="size-7"
        />
      </View>
    );
  }
};

const _Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarStyle: {
          backgroundColor: '#00244E',
          borderRadius: 50,
          marginHorizontal: 10,
          marginBottom: 36,
          height: 52,
          position: 'absolute',
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#00244E'
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.home}
              title="Home"
            />
          )
        }}
      />

      <Tabs.Screen
        name="missions"
        options={{
          headerShown: false,
          title: "Missions",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.missions}
              title="Missions"
            />
          )
        }}
      />

      <Tabs.Screen
        name="training"
        options={{
          headerShown: false,
          title: "Training",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.dumbbell}
              title="Training"
            />
          )
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.person}
              title="Profile"
            />
          )
        }}
      />
    </Tabs>
  );
};

export default _Layout;