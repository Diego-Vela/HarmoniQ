// Shimmer Text Unused
import React, { useRef, useEffect } from 'react';
import { Animated, View, StyleSheet, Text } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

type ShimmerTitleProps = {
  text: string; // Text to display
  textStyle?: object; // Custom styles for the text
  backgroundColor?: string; // Background color of the component
};

export default function ShimmerTitle({
  text = 'Training Complete!',
  textStyle = {},
  backgroundColor = 'transparent',
}: ShimmerTitleProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300], // Adjust this dynamically if needed
  });

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <MaskedView
        style={styles.maskedView}
        maskElement={
          <View style={styles.maskElement}>
            <Text style={[styles.text, textStyle]}>{text}</Text>
          </View>
        }
      >
        <Animated.View
          style={{
            flex: 1,
            transform: [{ translateX }],
          }}
        >
          <LinearGradient
            colors={['transparent', '#facc15', 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  maskedView: {
    height: 60,
  },
  maskElement: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
});
