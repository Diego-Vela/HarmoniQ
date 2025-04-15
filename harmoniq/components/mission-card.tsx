import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MissionWithProgress } from '@/constants/types';
import { useMissions } from '@/hooks/useMissions';

type Props = {
  mission: MissionWithProgress;
  onClaim: (mission: MissionWithProgress) => void;
};

const MissionCard: React.FC<Props> = ({ mission, onClaim }) => {
  const isComplete = mission.progress >= mission.goal;
  const isClaimed = useMissions((state) => state.claimedMissionIds.has(mission.id));


  return (
    <View className="flex justify-center border border-gray-600 rounded-xl mb-4 bg-dark-300 h-32 bg-opacity-50">
      <View className="rounded-xl shadow-lg w-full h-full opacity-95 flex-row justify-evenly items-center">
        {/* Text Section */}
        <View className="flex justify-center w-[60%] h-[100%]">
          <View className="flex justify-center items-center h-[60%] px-2">
            <Text className="text-white text-center font-semibold text-lg">{mission.title}</Text>
          </View>

          {/* Progress Bar */}
          <View className="relative h-[24px] w-[90%] self-center bg-gray-700 rounded-full overflow-hidden">
            <View
              className="absolute top-0 left-0 h-full rounded-full bg-accent shadow-[0_0_10px_#FFA500]"
              style={{ width: `${(mission.progress / mission.goal) * 100}%` }}
            />
            <View className="absolute w-full h-full justify-center items-center">
              <Text className="text-white text-sm font-semibold">
                {mission.progress} / {mission.goal}
              </Text>
            </View>
          </View>
        </View>

        {/* Claim Button */}
        <TouchableOpacity
          onPress={() => onClaim(mission)}
          disabled={!isComplete || isClaimed}
          className={`rounded-lg justify-center w-[25%] h-[80%] ${
            isClaimed
              ? 'bg-gray-600'
              : isComplete
              ? 'bg-green-600'
              : 'bg-gray-600'
          }`}
        >
          <Text className="text-white text-center text-sm font-semibold">
            {isClaimed ? 'Claimed' : 'Claim'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MissionCard;
