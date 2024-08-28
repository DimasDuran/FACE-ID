import { Stack } from 'expo-router';
import { UserActivityProvider } from '~/context/useActivity';

export default function Layout() {
  return (
    <UserActivityProvider>
      <Stack>
        <Stack.Screen name="(modals)/white"
         options={{
          headerShown:false,
          animation:'none'
         }}
        />
         <Stack.Screen name="(modals)/lock"
         options={{
          headerShown:false,
          animation:'none'
         }}
        />

      </Stack>
    </UserActivityProvider>
  );
}
