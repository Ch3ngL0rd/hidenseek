import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, Text } from 'react-native';

export default function CreateGame({ navigation }: { navigation: NavigationProp<any> }) {
    return (
        <SafeAreaView className="flex justify-center items-center flex-col">
            <Text>Tutorial</Text>
        </SafeAreaView>
    );
}   