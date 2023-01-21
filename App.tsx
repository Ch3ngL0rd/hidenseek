import React from 'react';
import { AuthProvider, useAuth } from './src/hooks/useAuth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './src/screens/home/home';
import CreateAccount from './src/screens/home/create-account';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="CreateAccount" component={CreateAccount}
            options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}