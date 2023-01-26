import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../settings/supabase';
import { useAuth } from '../../hooks/useAuth';
import UploadWidget from '../../components/uploadWidget';

export default function CreateAccount({ navigation }: { navigation: NavigationProp<any> }) {
    const auth = useAuth();

    const [loading, setLoading] = React.useState<boolean>(false);
    const [username, setUsername] = React.useState<string>('');
    const [name, setName] = React.useState<string>('');
    const [message, setMessage] = React.useState<string>('')
    const [avatarPath, setAvatarPath] = React.useState<string | undefined>(undefined)

    const submit = async () => {
        setLoading(true);
        try {
            if (username.length <= 3) {
                throw new Error('Choose a longer username');
            }
            if (name.length === 0) {
                throw new Error('Enter your name');
            }

            if (avatarPath === undefined) {
                throw new Error('Avatar not uploaded');
            }

            const { error: insertError } = await supabase
                .from('profiles')
                .insert([
                    { id: auth.user?.id, username: username, name: name, avatar: avatarPath },
                ])

            if (insertError) {
                throw new Error(insertError.message);
            }

            navigation.navigate("Home");
        } catch (error) {
            if (typeof error === 'string') {
                setMessage(error);
            } else {
                console.log(error);
            }
        } finally {
            setLoading(false);
        }
    }

    if (auth.user === null) {
        // loading spinner screen
        return (
            <SafeAreaView className="flex justify-center items-center flex-col">
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        )
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
            <UploadWidget onUpload={(filepath) => {
                setAvatarPath(filepath)
            }} size={150} id={auth.user.id} />
            <TouchableOpacity onPress={submit}>
                <Text>Submit</Text>
            </TouchableOpacity>
            {loading === true && <ActivityIndicator />}
        </SafeAreaView>
    );
}   