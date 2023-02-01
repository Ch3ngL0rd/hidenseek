// sets game start time to +2 minutes, game screens shows time until game starts run!
import { NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';
import { ActionSheetIOS, ActivityIndicator, Button, SafeAreaView, Text } from 'react-native';
import { useQuery } from 'react-query';
import { supabase } from '../../settings/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useGame } from '../../hooks/getGame';

// Ready up screen is a waiting screen for the game to start
// params must contain game_id  (game id)
// uses game_id to get live game data from database
// shows name of game, players, and time until game starts
// when game starts, navigates to game screen

export default function Ready({ navigation, route }: { navigation: NavigationProp<any>, route: RouteProp<any> }) {
    const auth = useAuth();
    const { loading, error, game } = useGame();

    React.useEffect(() => {
        if (game === undefined || game === null) return;
        if (game.start_time !== null) {
            navigation.navigate("Game")
        }
    }, [game])

    React.useEffect(() => {
        if (game === null || game === undefined) return;
        const insertUser = async () => {

            const { error } = await supabase
                .from('players')
                .upsert([{ profile_id: auth.user?.id, game_id: game.id }])

            if (error) {
                console.log(error)
            }
        }
        insertUser();
    }, [game])

    const leaveGame = () => {
        if (game === null || game === undefined) return;
        supabase
            .from('players')
            .delete()
            .eq('profile_id', auth.user?.id)
            .eq('game_id', game.id).then((res) => console.log(res))

        navigation.navigate("Waiting", { game_id: game.id })
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