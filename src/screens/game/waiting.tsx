import { NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, Text } from 'react-native';

// A waiting screen for the players
// params must contain game_id  (game id)

export default function Waiting({ navigation, route }: { navigation: NavigationProp<any>, route: RouteProp<any, any> }) {
    const { game_id } = route.params;

    return (
        <SafeAreaView className="flex justify-center items-center flex-col">
            <Text>WAITING</Text>
        </SafeAreaView>
    );
}