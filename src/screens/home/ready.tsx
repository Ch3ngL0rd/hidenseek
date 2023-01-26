// sets game start time to +2 minutes, game screens shows time until game starts run!
import { NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';
import { ActionSheetIOS, ActivityIndicator, Button, SafeAreaView, Text } from 'react-native';
import { useQuery } from 'react-query';
import { supabase } from '../../settings/supabase';
import { useAuth } from '../../hooks/useAuth';

// Ready up screen is a waiting screen for the game to start
// params must contain game_id  (game id)
// uses game_id to get live game data from database
// shows name of game, players, and time until game starts
// when game starts, navigates to game screen

interface GameInterface {
    code: string,
    created_at: string,
    creator: {
        username: string
    },
    game_length: number,
    id: number,
    name: string,
    start_time: string | null,
}

export default function Ready({ navigation, route }: { navigation: NavigationProp<any>, route: RouteProp<any> }) {
    const auth = useAuth();
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);
    const [game, setGame] = React.useState<GameInterface | undefined>(undefined);
    const { game_id } = route.params;

    React.useEffect(() => {
        setLoading(true)
        const game = supabase
            .from("games")
            .select(`
                *,
                creator (username)
            `)
            .eq("id", game_id)
            .single()
            .then(
                (res) => {
                    console.log(res);
                    if (res.error) {
                        setError(res.error.message)
                    } else {
                        setGame(res.data)
                    }
                    setLoading(false)
                }
            )
        const game_update = supabase.channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'games' },
                (payload) => {
                    console.log('Change received!', payload)
                    if (payload.new) { setGame(payload.new) }
                }
            )
            .subscribe()
        return () => {
            game_update.unsubscribe()
        }
    }, [])

    React.useEffect(() => {
        if (game === undefined) return;
        if (game.start_time !== null) {
            navigation.navigate("Game", { game_id: game_id })
        }
    }, [game])

    React.useEffect(() => {
        const insertUser = async () => {

            const { error } = await supabase
                .from('players')
                .upsert([{ profile_id: auth.user?.id, game_id: game_id }])

            if (error) {
                console.log(error)
            }
        }
        insertUser();
    }, [])

    const leaveGame = () => {
        supabase
            .from('players')
            .delete()
            .eq('profile_id', auth.user?.id)
            .eq('game_id', game_id).then((res) => console.log(res))

        navigation.navigate("Home")
    }

    if (loading || game === undefined) {
        return (
            <SafeAreaView className="flex justify-center items-center flex-col">
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex justify-center items-center flex-col">
            <Text className="text-2xl font-bold">{game.name}</Text>
            <Text className="text-xl font-bold">Created by: {game.creator.username}</Text>
            <Text className="text-xl font-bold">Game Code: {game.code}</Text>
            <Text className="text-xl font-bold">Game starting soon</Text>
            <Button title="Leave Game" onPress={leaveGame} />
        </SafeAreaView>
    );
}