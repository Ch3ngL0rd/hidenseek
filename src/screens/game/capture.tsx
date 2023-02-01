// A page that exposes expo's camera interface to take a picture and upload it to supabase storage
// Uses the expo-camera package
// allows users to choose which player they are
// uploads the capture to the table 'captures'

// first select your target player
// then take a picture - modal pops up
// then you can see the picture you took
// then you can upload it to the database

import { NavigationProp, RouteProp } from "@react-navigation/native";
import { Camera, CameraCapturedPicture, CameraType } from 'expo-camera';
import React from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../settings/supabase";
import { useGame } from "../../hooks/getGame";
import { decode } from 'base64-arraybuffer'
import { getPlayers } from "../../hooks/getPlayers";
import { PlayerAvatar } from "../../components/profile";


interface Capture {
    id: number,
    game_id: number,
    player_id: string,
    path: string,
    created_at: string,
    captured_at: string,
}

export default function Capture({ navigation, route }: { navigation: NavigationProp<any>, route: RouteProp<any, any> }) {
    const auth = useAuth();
    const { game, loading, error } = useGame();
    const { players, loading: players_loading, error: players_error } = getPlayers(game!.id);
    const [status, requestPermission] = Camera.useCameraPermissions();
    const [capture, setCapture] = React.useState<CameraCapturedPicture | null>(null);
    const [selected, setSelected] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<string | null>(null);
    const cameraRef = React.useRef<Camera | null>(null);

    React.useEffect(() => {
        if (status === null) {
            requestPermission();
            return;
        }
        if (status.status === 'granted') {
            console.log('camera permission granted');
        } else {
            requestPermission();
        }
    }, [status])

    React.useEffect(() => {
        // logs players
        console.log(players);
    }, [players])

    const takePicture = async () => {
        if (cameraRef.current !== null) {
            const photo = await cameraRef.current.takePictureAsync(
                {
                    quality: 0.5,
                    base64: true,
                }
            );
            if (photo === null) return;
            setCapture(photo);
        }
    }

    const removePicture = async () => {
        setCapture(null);
        setMessage(null);
        setSelected(null);
    }

    const uploadPicture = async () => {
        if (capture === null || !capture.base64) return;
        if (selected === null) {
            setMessage("Please select a player");
            return;
        }

        // uploads base64 string to supabase storage as jpg
        const { data, error } = await supabase.storage.from('captures')
            .upload(`capture-${auth.user?.id}-${new Date().toISOString()}.jpg`, decode(capture.base64),
                {
                    contentType: 'image/jpeg',
                }
            );

        if (error !== null) {
            console.log("upload error", error);
            return;
        }

        const { data: capture_data, error: capture_error } = await supabase.from('captures').insert([
            {
                game_id: game?.id,
                player_id: auth.user?.id,
                captured_id: selected,
                path: data.path,
            }
        ]);
        if (capture_error !== null) {
            console.log("capture error is", capture_error);
            return;
        }
        console.log("capture data is", capture_data);
        removePicture();
    }

    if (auth.loading || auth.user === null) {
        return <View />;
    }

    // screen shows camera initially
    // once picture has been taken, it shows the picture
    // list of players is shown next to picture
    // user can select which player they are
    // then they can upload the picture to the database

    if (loading || error !== null) {
        console.log("error is", error)
        return <View />;
    }
    if (players_loading || players_error !== null) {
        console.log("players error is", players_error)
        return <View />;
    }

    if (status !== null && status.status === 'granted' && capture === null) {
        return (
            <View style={{ flex: 1 }}>
                {capture === null &&
                    <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} ref={cameraRef}>
                        <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row' }}>
                            <TouchableOpacity
                                style={{
                                    flex: 0.1,
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    takePicture();
                                }}>
                                <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Capture </Text>
                            </TouchableOpacity>
                        </View>
                    </Camera>
                }
            </View>
        );
    }

    if (capture !== null) {
        return (
            <View style={{ flex: 1 }}>
                <Image
                    source={{ uri: capture.uri }}
                    style={{ flex: 1, resizeMode: 'contain' }}
                />
                {message !== null && <Text>{message}</Text>}
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                    }}>
                    {players.map((player) => {
                        return (
                            <TouchableOpacity
                                key={player.id}
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    backgroundColor: selected === player.id ? 'red' : 'transparent',
                                }}
                                onPress={() => {
                                    setSelected(player.id);
                                }}>
                                <PlayerAvatar {...player} />
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <View style={{ flex: 1, justifyContent: 'space-around', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            alignItems: 'center',
                        }}
                        onPress={() => {
                            uploadPicture();
                        }}>
                        <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Upload </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            alignItems: 'center',
                        }}
                        onPress={() => {
                            removePicture();
                        }}>
                        <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Remove </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return <View />;




}