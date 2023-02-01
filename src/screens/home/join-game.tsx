import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { Button, SafeAreaView, Text, TextInput } from 'react-native';
import { supabase } from '../../settings/supabase';
import { useGame } from '../../hooks/getGame';

export default function JoinGame({ navigation }: { navigation: NavigationProp<any> }) {
    const [gameCode, setGameCode] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>("");
    const game = useGame();

    const joinGame = async () => {
        setLoading(true);
        // Make sure that game exists
        let { data: game, error } = await supabase
            .from('games')
            .select("*")
            .eq('code', gameCode)
            .single()
        if (error) {
            console.log(error);
            setMessage("Error joining game")
            setLoading(false);
            return;
        } else if (!game) {
            setMessage("Game does not exist");
            setLoading(false);
            return;
        } else if (game.length === 0) {
            setMessage("Game does not exist");
            setLoading(false);
            return;
        }
        // updates getGame hook
        game.joinGame(game.id)
        if (game.start_time !== null) {
            navigation.navigate("Game", { game_id: game.id })
        } else {
            navigation.navigate("Ready", { game_id: game.id })
        }
        setLoading(false);
    }

    return (
        <SafeAreaView className="flex justify-center items-center flex-col">
            <Text>Game Code</Text>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={text => setGameCode(text.toUpperCase())}
                value={gameCode}
                placeholder="Enter Game Code"
            />
            <Button title="Join Game" onPress={joinGame} />
        </SafeAreaView>
    );
}   