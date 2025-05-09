import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { MissionWithProgress } from '@/constants/types';
import { useMissions } from '@/stores/useMissionsStore';

const { height } = Dimensions.get('window'); // Get screen height

type Props = {
  mission: MissionWithProgress;
  onClaim: (mission: MissionWithProgress) => void;
};

const MissionCard: React.FC<Props> = ({ mission, onClaim }) => {
  const isComplete = mission.progress >= mission.goal;
  const isClaimed = useMissions((state) =>
    mission.id.startsWith('d')
      ? state.claimedMissionIds.includes(mission.id)
      : state.claimedWeeklyMissionIds.includes(mission.id)
  );

  return (
    <View
      className="flex-col justify-center border border-gray-600 rounded-xl mb-4 bg-dark-300 bg-opacity-30"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        height: height * 0.15, // Set height as 15% of the screen height
      }}
    >
      <View className="rounded-xl shadow-lg w-full h-full opacity-95 flex-row justify-evenly items-center">
        {/* Text Section */}
        <View className="flex-col justify-evenly w-[65%] h-[100%] items-center">
          <View className="flex justify-center items-center h-[50%] w-[95%]">
            <Text adjustsFontSizeToFit numberOfLines={2} className="text-white text-center font-semibold text-xl w-full ">
              {mission.title}
            </Text>
          </View>

          {/* Progress Bar */}
          <View className="relative h-[24px] w-[90%] self-center bg-gray-700 rounded-full overflow-hidden">
            <View
              className="absolute top-0 left-0 h-full rounded-full bg-accent shadow-[0_0_10px_#FFA500] z-10"
              style={{ width: `${(mission.progress / mission.goal) * 100}%` }}
            />
            <View className="absolute w-full h-full justify-center items-center">
              <Text className="text-white text-sm font-semibold z-50">
                {mission.progress} / {mission.goal}
              </Text>
            </View>
          </View>
        </View>

        {/* Claim Button */}
        <TouchableOpacity
          onPress={() => onClaim(mission)}
          disabled={!isComplete || isClaimed}
          className={`rounded-lg justify-center w-[30%] h-[80%] ${
            isClaimed
              ? 'bg-gray-600'
              : isComplete
              ? 'bg-green-600'
              : 'bg-gray-600'
          }`}
        >
          <Text
            className="text-white text-center font-semibold"
            style={{
              fontSize: Platform.OS === 'android' ? 14 : 18, // text-md for Android, text-lg for iOS
            }}
          >
            {isClaimed ? 'Claimed' : 'Claim'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MissionCard;
