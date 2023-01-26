import React from 'react';
import { AuthProvider, useAuth } from './src/hooks/useAuth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native'
  ;
import Home from './src/screens/home/home';
import CreateAccount from './src/screens/home/create-account';
import Tutorial from './src/screens/home/tutorial';
import CreateGame from './src/screens/home/create-game';
import JoinGame from './src/screens/home/join-game';
import StartGame from './src/screens/home/start-game';
import Ready from './src/screens/home/ready';
import Feed from './src/screens/game/feed';

const Stack = createNativeStackNavigator();
const BottomNavigator = createBottomTabNavigator();

const Game = () => {
  return (
    <BottomNavigator.Navigator>
      <BottomNavigator.Screen name="Feed" component={Feed} />
    </BottomNavigator.Navigator>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="CreateAccount" component={CreateAccount}
            options={{ headerShown: false }} />
          <Stack.Screen name="CreateGame" component={CreateGame} />
          <Stack.Screen name="StartGame" component={StartGame} />
          <Stack.Screen name="Ready" component={Ready} />
          <Stack.Screen name="JoinGame" component={JoinGame} />
          <Stack.Screen name="Tutorial" component={Tutorial} />
          <Stack.Screen name="Game" component={Game} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}