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
      <View
        className="flex-row w-full bg-accent justify-center items-center rounded-full overflow-hidden"
        style={{
          height: RFValue(45),
          width: RFValue(100),
          paddingBottom: 0,
          paddingTop: 0,
        }}
      >
        <Image
          source={icon}
          tintColor="#00244E"
          className="size-7 self-center"
          resizeMode="contain"
        />
        <Text
          style={{ 
            fontSize: RFValue(11),
            paddingBottom: 0,
            paddingTop: 0,
           }} // Adjust the value as needed
          className="text-primary font-semibold text-center ml-[5%]" adjustsFontSizeToFit numberOfLines={1}
        >
          {title}
        </Text>
      </View>
    );
  } else {
    return (
      <View className="size-full justify-center items-center rounded-full overflow-hidden">
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
          alignSelf: 'center',
          flexDirection: 'row',
        },
        tabBarStyle: {
          backgroundColor: '#00244E',
          borderRadius: RFValue(22.5),
          marginHorizontal: '2%',
          marginBottom: RFValue(32),
          height: RFValue(45),
          position: 'absolute',
          overflow: 'hidden',
          borderWidth: 2,
          borderColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 0,
          paddingTop: 0,

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