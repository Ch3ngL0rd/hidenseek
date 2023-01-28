import { NavigationProp, RouteProp, getPathFromState } from '@react-navigation/native';
import React from 'react';
import { Button, SafeAreaView, Text, View, Image } from 'react-native';
import { getGame } from '../../hooks/getGame';
import { getPlayers } from '../../hooks/getPlayers';
import { supabase } from '../../settings/supabase';

// A waiting screen for the players
// params must contain game_id  (game id)

// Shows a countdown timer from 2 minutes to 0 
// When the timer reaches 0, the game starts - navigate to the game screen
// Shows players who are in the game
// Shows avatar of the player


export default function Waiting({ navigation, route }: { navigation: NavigationProp<any>, route: RouteProp<any, any> }) {
    const { game_id } = route.params;
    const { game, loading, error } = getGame(game_id);
    const { players } = getPlayers(game_id);
    const [url, setUrl] = React.useState<string | undefined>(undefined);
    const [countdown, setCountdown] = React.useState<number | undefined>(undefined)

    React.useEffect(() => {
        if (game !== undefined && game !== null && game.start_time !== null) {
            // Set seconds to the difference between game.start_time and two mintues from now
            const future_time = new Date(game.start_time).getTime() + 120000;
            const current_time = new Date().getTime();
            const diff = Math.floor((future_time - current_time) / 1000);
            console.log(`diff is ${diff} seconds`);
            setCountdown(diff);
            // // starts interval to update the countdown
            const interval = setInterval(() => {
                setCountdown((prev) => prev === undefined ? undefined : prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [game])

    React.useEffect(() => {
        players?.forEach((player) => {
            getImage(player.avatar);
        }
        )
    }, [players])

    React.useEffect(() => {
        if (countdown !== undefined && countdown <= 0) {
            // navigation.navigate("Game", { game_id: game_id })
            // navigates to game screen and prevents going back
            navigation.reset({
                index: 0,
                routes: [{ name: 'Game', params: { game_id: game_id } }],
            });
        }
    }, [countdown])

    const getImage = async (uri: string) => {
        // gets image from supabase
        console.log(`loading file ${uri} from avatars`);
        const { data } = await supabase.storage.from('avatars').getPublicUrl(uri);
        setUrl(data.publicUrl);
        console.log(`url is ${data.publicUrl}`);
        return data;

    }

    if (loading || game === undefined || countdown === undefined) {
        return (
            <SafeAreaView className="flex justify-center items-center flex-col">
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    if (error || game === null) {
        return (
            <SafeAreaView className="flex justify-center items-center flex-col">
                <Text>Error</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex justify-center items-center flex-col">
            <Text>Waiting</Text>
            <Text>Game name {game.name}</Text>
            <Text>Starts in {game.start_time}</Text>
            <Text>Game starts in {countdown} seconds</Text>
            {url !== undefined && <Image source={{ uri: url }} style={{ width: 300, height: 300 }} />}
            <Text>Players in game:</Text>
            {
                players.map((player) => {
                    return (
                        <View key={player.id}>
                            <Text>{player.name}</Text>
                            <Image source={{ uri: player.avatar }} />
                        </View >
                    )
                })
            }
        </SafeAreaView >
    );
}