// sets game start time to +2 minutes, game screens shows time until game starts run!
import { NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';
import { ActionSheetIOS, ActivityIndicator, Button, SafeAreaView, Text } from 'react-native';
import { useQuery } from 'react-query';
import { supabase } from '../../settings/supabase';
import { useAuth } from '../../hooks/useAuth';
import { getGame } from '../../hooks/getGame';

// Ready up screen is a waiting screen for the game to start
// params must contain game_id  (game id)
// uses game_id to get live game data from database
// shows name of game, players, and time until game starts
// when game starts, navigates to game screen

export default function Ready({ navigation, route }: { navigation: NavigationProp<any>, route: RouteProp<any> }) {
    const auth = useAuth();
    const { game_id } = route.params;
    const { loading, error, game } = getGame(game_id);

    React.useEffect(() => {
        if (game === undefined || game === null) return;
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

        navigation.navigate("Waiting", { game_id: game_id })
    }

    if (loading === true || game === undefined) {
        return (
            <SafeAreaView className="flex justify-center items-center flex-col">
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    if (game === null) {
        return (
            <SafeAreaView className="flex justify-center items-center flex-col">
                <Text className="text-2xl font-bold">Game not found</Text>
                <Button title="Leave Game" onPress={leaveGame} />
            </SafeAreaView>
        )
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