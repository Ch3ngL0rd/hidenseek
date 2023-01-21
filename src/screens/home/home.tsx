import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, Text } from 'react-native';
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
            <Text>HOME</Text>
        </SafeAreaView>
    );
}   