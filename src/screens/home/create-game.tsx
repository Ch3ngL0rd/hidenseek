import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { Button, Pressable, SafeAreaView, Text, View } from 'react-native';
import { supabase } from '../../settings/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useGame } from '../../hooks/getGame';

const nouns: string[] =
    ['Dogs', 'Noobs', 'Potatoes', 'Aunties', 'Fangirls', 'Fools',
        'Geeks', 'Roos', 'Gorillas', 'Hipsters', 'Toasters',
        'Tables', 'Underdogs', 'Nerds', 'Engineers', 'Athletes']

const adjectives: string[] =
    ['Spontaneous', 'Gleaming', 'Fanciful', 'Whimsical', 'Exalted', 'Adventurous',
        'Glamorous', 'Graceful', 'Poised', 'Diligent', 'Daring', 'Enthusiastic',
        'Quirky', 'Elegant', 'Innovative', 'Versatile', 'Optimistic', 'Ambitious', 'Determined', 'Daring']

interface GameForm {
    game_length: number,
    name: string,
    start_time: number | null,
    creator: string,
}

export default function CreateGame({ navigation }: { navigation: NavigationProp<any> }) {
    const auth = useAuth();
    const game = useGame();
    const [name, setName] = React.useState<string>('');
    const [gameLength, setGameLength] = React.useState<number>(15);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);

    const randomiseName = () => {
        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        setName(`The ${adjective} ${noun}`)
    }

    const generateCode = (length: number): string => {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const createGame = async () => {
        if (loading) {
            return;
        }
        setLoading(true);
        const game_form = {
            game_length: gameLength,
            name: name,
            start_time: null,
            creator: auth.user?.id,
            code: generateCode(6),
        } as GameForm;

        console.log("game form");
        console.log(game_form);
        const { data, error } = await supabase
            .from('games')
            .insert([
                game_form
            ])
            .select()
            .single()
        if (error) {
            console.log(error);
            setError(error.message)
        } else {
            console.log("game created");
            console.log(data);
            if (data.length === 0) {
                setError("Error creating game");
            } else {
                // Join game
                game.joinGame(data.id)
                navigation.navigate("StartGame", { game_id: data[0].id })
            }
        }
        setLoading(false);
    }

    React.useEffect(() => {
        randomiseName()
    }, [])
    return (
        <SafeAreaView className="flex justify-center items-center flex-col">
            <Text>{name}</Text>
            <Button title="Randomise Name" onPress={randomiseName} />
            <View className="flex flex-row justify-between items-center w-full">
                <Pressable
                    className={`w-1/3 h-10 ${gameLength === 10 ? "bg-green-500" : "bg-gray-500"}`}
                    onPress={() => setGameLength(10)}
                >
                    <Text>10 Minutes</Text>
                </Pressable>
                <Pressable
                    className={`w-1/3 h-10 ${gameLength === 15 ? "bg-green-500" : "bg-gray-500"}`}
                    onPress={() => setGameLength(15)}
                >
                    <Text>15 Minutes</Text>
                </Pressable>
                <Pressable
                    className={`w-1/3 h-10 ${gameLength === 30 ? "bg-green-500" : "bg-gray-500"}`}
                    onPress={() => setGameLength(30)}
                >
                    <Text>30 Minutes</Text>
                </Pressable>
            </View>
            <Button title="Create Game" onPress={createGame} />
        </SafeAreaView>
    );
}   