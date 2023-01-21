import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

export default function Home({ navigation }: { navigation: NavigationProp<any> }) {
    const [loading, setLoading] = React.useState<boolean>(true);

    const auth = useAuth();
    React.useEffect(() => {
        if (auth.userData === undefined) {
            navigation.navigate("CreateAccount")
        } else if (auth.userData !== null) {
            setLoading(false);
        }
    }, [auth.userData])

    return (
        <SafeAreaView className="flex justify-center items-center flex-col">
            <TouchableOpacity onPress={() => navigation.navigate("Tutorial")}>
                <Text>Tutorial</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("JoinGame")}>
                <Text>Join Game</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("CreateGame")}>
                <Text>Create Game</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}   