// sets game start time to +2 minutes, game screens shows time until game starts run!
import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, Text } from 'react-native';

export default function StartGame({ navigation }: { navigation: NavigationProp<any> }) {
    return (
        <SafeAreaView className="flex justify-center items-center flex-col">
            <Text>Tutorial</Text>
        </SafeAreaView>
    );
}   