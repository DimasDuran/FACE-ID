import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserActivityProvider = ({ children }: { children: React.ReactNode }) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const LOCK_TIME = 3000;

  useEffect(() => {
    const handleUserActivity = () => {
      console.log('User is active');

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        console.log('User is inactive. Locking the screen...');
        router.push('/(modals)/lock'); // Redirige a la pantalla de bloqueo si el usuario está inactivo
      }, LOCK_TIME); // Utiliza LOCK_TIME para definir el tiempo de inactividad
    };

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      console.log('AppState changed:', nextAppState);

      if (nextAppState === 'inactive') {
        handleUserActivity();
        router.push('/(modals)/white');
      } else if (nextAppState === 'background') {
        recordStartTime();
      } else if (nextAppState === 'active') {
        // Recuperar el tiempo de inicio desde AsyncStorage
        const startTime = await AsyncStorage.getItem('startTime');
        const elapsed = Date.now() - (startTime ? parseInt(startTime, 10) : 0);

        if (elapsed >= LOCK_TIME) {
          router.push('/(modals)/lock');
        } else if (router.canGoBack()) {
          router.back();
        }
      }
    };

    // Escuchar el cambio de estado de la aplicación
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Limpieza
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      subscription.remove();
    };
  }, []);

  const recordStartTime = async () => {
    try {
      await AsyncStorage.setItem('startTime', Date.now().toString());
    } catch (error) {
      console.error("Error al guardar el tiempo de inicio", error);
    }
  };

  return <>{children}</>;
};
