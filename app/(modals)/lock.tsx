import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

const LockScreen: React.FC = () => {
  const [code, setCode] = useState<number[]>([]);
  const codeLength = Array(6).fill(0);
  const router = useRouter();
  const offset = useSharedValue(0)
  const OFFSET=20
  const TIME=80
  const style = useAnimatedStyle(() =>{
    return{
      transform:[{translateX:offset.value}]
    }
  })


  useEffect(() => {
    if (code.length === 6) {
      if (code.join('') === '111111') {
        router.replace('/')
        setCode([])
      }else{
        offset.value = withSequence(
          withTiming(-OFFSET,{duration: TIME / 2}),
          withRepeat(withTiming(OFFSET,{duration:TIME}),4,true),
          withTiming(0,{duration:TIME / 2}),
        )
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        setCode([])
      }
    }
  }, [code]);

  const onNumberPress = useCallback((number: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCode(prevCode => [...prevCode, number]);
  }, []);

  const onNumberBackSpace = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCode(prevCode => prevCode.slice(0, -1));
  }, []);

  const onBiometric = async () => {
    const {success} = await LocalAuthentication.authenticateAsync()
    if (success) {
      router.replace('/')
    }else{
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.greeting}>Welcome back, Jose 🙂  </Text>
      <Animated.View style={[styles.codeView,style]}>
        {codeLength.map((_, index) => (
          <View
            key={index}
            style={[
              styles.codeEmpty,
              { backgroundColor: code[index] ? '#3D38ED' : 'lightgrey' }
            ]}
          />
        ))}
      </Animated.View>
      <View style={styles.numberContainer}>
        {[1, 2, 3].map(number => (
          <TouchableOpacity
            key={number}
            style={styles.numberButton}
            onPress={() => onNumberPress(number)}
          >
            <Text style={styles.number}>{number}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.numberContainer}>
        {[4, 5, 6].map(number => (
          <TouchableOpacity
            key={number}
            style={styles.numberButton}
            onPress={() => onNumberPress(number)}
          >
            <Text style={styles.number}>{number}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.numberContainer}>
        {[7, 8, 9].map(number => (
          <TouchableOpacity
            key={number}
            style={styles.numberButton}
            onPress={() => onNumberPress(number)}
          >
            <Text style={styles.number}>{number}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.biometricsAndZeroContainer}>
        <TouchableOpacity onPress={onBiometric}>
          <MaterialCommunityIcons name="face-recognition" size={26} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.numberButton}
          onPress={() => onNumberPress(0)}
        >
          <Text style={styles.number}>0</Text>
        </TouchableOpacity>
        <View style={{minWidth:30}}>
          {code.length > 0 &&(
             <TouchableOpacity
             style={styles.numberButton}
             onPress={onNumberBackSpace}
           >
          <MaterialCommunityIcons name="backspace-outline" size={26} color="black" />
          </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LockScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 40,
  },
  codeView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,  // Reducido el margen vertical para mejor ajuste
    gap: 20,
  },
  codeEmpty: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  numberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',  // Ajustado el ancho para centrado
    marginVertical: 10,
  },
  numberButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#DDDDDD',
  },
  number: {
    fontSize: 32,
  },
  deleteButton: {
    marginTop: 20,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#FF6F6F',
  },
  deleteText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  biometricsAndZeroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '60%',  // Ajustado el ancho para centrar el contenido
    marginTop: 20,
  },
});
