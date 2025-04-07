import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { useXP } from '@/hooks/useXp';

const LevelUpPopup = () => {
  const { justLeveledUp, level } = useXP();

  return (
    <Modal transparent visible={justLeveledUp} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.levelText}>🎉 Level Up!</Text>
          <Text style={styles.level}>You're now Level {level}!</Text>
        </View>
      </View>
    </Modal>
  );
};

export default LevelUpPopup;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#FF7900',
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: 'center',
  },
  levelText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
  },
  level: {
    fontSize: 20,
    marginTop: 10,
    color: 'white',
  },
});
