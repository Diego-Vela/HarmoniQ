import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CollapsibleStatSection = ({
  title,
  stats,
}: {
  title: string;
  stats: {
    trainingsCompleted: number;
    trainingStats: Record<string, { total: number; subcategories: Record<string, number> }>;
  };
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="bg-primary px-5 py-5 rounded-2xl mb-6 mx-5 shadow-md">
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        className="flex-row items-center justify-between"
      >
        <Text className="text-white text-xl font-bold">{title}</Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={22}
          color="#facc15"
        />
      </TouchableOpacity>

      {expanded && (
        <View className="mt-4">
          <Text className="text-white text-base mb-3">
            Total Trainings: {stats.trainingsCompleted}
          </Text>
          {Object.entries(stats.trainingStats).map(([cat, stat]) => (
            <View key={cat} className="mb-3">
              <Text className="text-white font-bold text-base capitalize mb-1">{cat}</Text>
              <Text className="text-white text-sm mb-1">Total: {stat.total}</Text>
              {Object.entries(stat.subcategories).map(([sub, count]) => (
                <Text key={sub} className="text-gray-300 text-sm pl-4 mb-1">
                  • {sub}: {count}
                </Text>
              ))}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default CollapsibleStatSection;