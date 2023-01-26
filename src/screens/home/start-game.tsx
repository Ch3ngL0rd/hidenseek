// sets game start time to +2 minutes, game screens shows time until game starts run!
import { NavigationProp, RouteProp } from '@react-navigation/native';
import React from 'react';
import { Button, SafeAreaView, Text, View } from 'react-native';
import { getGame } from '../../hooks/getGame';
import { useQuery } from 'react-query';
import { supabase } from '../../settings/supabase';

interface Player {
    created_at: string,
    game_id: number,
    profile_id: string,
}

interface Profile {
    id: string,
    name: string,
    username: string,
    avatar: string,
}

export default function StartGame({ navigation, route }: { navigation: NavigationProp<any>, route: RouteProp<any, any> }) {
    const { game_id } = route.params;
    const { game, loading, error } = getGame(game_id);
    const [players, setPlayers] = React.useState<Profile[]>([]);

    // Gets a live list of which players are in the game
    React.useEffect(() => {
        console.log("Subscribing to game", game_id);
        const players = supabase.channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'players' },
                async (payload) => {
                    // gets profile
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', payload.new.profile_id)
                        .single();

                    switch (payload.eventType) {
                        case 'INSERT':
                            setPlayers((prev) => [...prev, data]);
                            break;
                        case 'DELETE':
                            setPlayers((prev) => prev.filter((player) => player.id !== payload.old.profile_id));
                            break;
                    }
                }
            )
            .subscribe()
    }, [])

    React.useEffect(() => {
        console.log(players);
    }, [players])

    const startGame = () => {
        // Sets the game time to the current time as a unix timestamp and returns the record
        supabase
            .rpc('start_game', {
                game_id
            }).then((res) => {
                if (res.error === null) {
                    navigation.navigate("Waiting", { game_id: game_id })
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