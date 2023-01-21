import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, Text } from 'react-native';

export default function Tutorial({ navigation }: { navigation: NavigationProp<any> }) {
    return (
        <SafeAreaView className="flex justify-center items-center flex-col">
            <Text>
                Welcome to Real Royale, the ultimate Battle Royale experience!
            </Text>
            <Text>
                Players use their camera to eliminiate other players, by taking photos of them.
            </Text >
            <Text>
                Once a player has been eliminated, others players confirm it's them.
            </Text>
            <Text>
                Watch out! Once you take the photo of someone, your GPS location will be leaked,
                meaning other players will know your rough location.
            </Text>
            <Text>
                Good luck and have fun!
            </Text>
        </SafeAreaView>
    );
}