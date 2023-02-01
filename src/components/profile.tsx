import { StyleSheet, View, Text, Image } from 'react-native'
import { Profile } from '../hooks/getPlayers';
import React from 'react';
import { supabase } from '../settings/supabase';

export const PlayerAvatar = (props: Profile) =>  {
    const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null)

    React.useEffect(() => {
        const fetchAvatar = async () => {
            const { data } = await supabase.storage
                .from('avatars')
                .getPublicUrl(props.avatar);

            if (data) {
                setAvatarUrl(data.publicUrl)
            }
        }
        fetchAvatar();
    }, [props.avatar])



    return (
        <View style={styles.container}>
            {avatarUrl !== null &&
                <Image
                    source={{ uri: avatarUrl }}
                    style={styles.avatar}
                />
            }
            <Text style={styles.username}>{props.username}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    username: {
        fontSize: 20,
    },
});