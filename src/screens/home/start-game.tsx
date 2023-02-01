// sets game start time to +2 minutes, game screens shows time until game starts run!
import { NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';
import { Button, SafeAreaView, Text, View } from 'react-native';
import { useGame } from '../../hooks/getGame';
import { useQuery } from 'react-query';
import { supabase } from '../../settings/supabase';
import { getPlayers } from '../../hooks/getPlayers';


export default function StartGame({ navigation, route }: { navigation: NavigationProp<any>, route: RouteProp<any, any> }) {
    const { game, loading, error } = useGame();
    const { players } = getPlayers(game!.id);

    const startGame = () => {
        // Sets the game time to the current time as a unix timestamp and returns the record
        supabase
            .rpc('start_game', {
                game_id: game!.id
            }).then((res) => {
                if (res.error === null) {
                    navigation.navigate("Waiting",)
                }
            })

    }

    if (game === undefined || loading === true) {
        return (
            <SafeAreaView className="flex justify-center items-center flex-col">
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }
    if (game === null) {
        return (
            <SafeAreaView className="flex justify-center items-center flex-col">
                <Text>Game not found</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex justify-center items-center flex-col">
            <Text>{game.name}</Text>
            <Text>Players:</Text>
            {players.map((player) => {
                return (
                    <View key={player.id}>
                        <Text>{player.name}</Text>
                    </View>
                )
            })}
            <Text>{game.code}</Text>
            <Button title="Start Game" onPress={startGame} />
        </SafeAreaView>
    );
}   