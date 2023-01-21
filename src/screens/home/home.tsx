import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { Button, SafeAreaView, Text, View } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

export default function Home({ navigation }: { navigation: NavigationProp<any> }) {
    return (
        <SafeAreaView className="flex justify-center items-center flex-col">
            <Text>HOME</Text>
        </SafeAreaView>
    );
}