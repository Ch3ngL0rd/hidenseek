import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export const Private = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
            </Stack.Navigator>
        </NavigationContainer>
    )
}
