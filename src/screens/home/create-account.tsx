import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../settings/supabase';
import { useAuth } from '../../hooks/useAuth';

export default function CreateAccount({ navigation }: { navigation: NavigationProp<any> }) {
    const auth = useAuth();

    const [loading, setLoading] = React.useState<boolean>(false);
    const [username, setUsername] = React.useState<string>('');
    const [name, setName] = React.useState<string>('');
    const [message, setMessage] = React.useState<string>('')

    const submit = async () => {
        setLoading(true);
        if (username.length <= 3) {
            setMessage('Choose a longer username');
            setLoading(false);
            return;
        }
        if (name.length == 0) {
            setMessage("Please enter your name");
            setLoading(false);
            return;
        }

        {
            let { data: profiles, error } = await supabase
                .from('profiles')
                .select("*")
                .ilike('username', username);

            if (error) {
                setMessage(error.message);
                setLoading(false);
                return;
            }
            if (profiles?.length !== 0) {
                setMessage("Username taken. Choose another!")
                setLoading(false);
                return;
            }
        }

        const { data, error } = await supabase
            .from('profiles')
            .insert([
                { id: auth.user?.id, username: username, name: name },
            ])

        if (error) {
            setMessage(error.message);
            setLoading(false);
            return;
        }
        setLoading(false);
        
        navigation.navigate("Home");
    }

    return (
        <SafeAreaView className="flex justify-center items-center flex-col">
            <Text>{message}</Text>
            <Text>USERNAME</Text>
            <TextInput
                placeholder="Enter username"
                onChangeText={text => setUsername(text)}
                value={username}
            />
            <Text>NAME</Text>
            <TextInput
                placeholder="Enter name"
                onChangeText={text => setName(text)}
                value={name}
            />
            <TouchableOpacity onPress={submit}>
                <Text>Submit</Text>
            </TouchableOpacity>
            {loading === true && <ActivityIndicator />}
        </SafeAreaView>
    );
}   