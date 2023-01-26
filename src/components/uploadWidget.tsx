import { useState, useEffect } from 'react'
import { StyleSheet, View, Alert, Image, Button } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../settings/supabase'

interface Props {
    size: number,
    id: string,
    onUpload: (filePath: string) => void,
}

export default function UploadWidget({ size, onUpload, id }: Props) {
    const [uploading, setUploading] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const avatarSize = { height: size, width: size }

    async function uploadAvatar() {
        console.info("Trying to upload avatar")
        try {
            setUploading(true)
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
                base64: true,
            });
            if (!result.assets) {
                throw new Error('No image selected');
            }
            if (result.assets.length === 0) {
                throw new Error('No image selected');
            }

            const file = result.assets[0];

            // checks that file can exist as base64 representation 
            if (file.base64 === undefined || file.base64 === null) {
                throw new Error('File too large');
            }

            const file_extension = file.uri.split('.').pop();
            const base64_representation = `data:${file.type};base64,${file.base64}`;

            let { error } = await supabase.storage.from('avatars').upload(
                `${id}.${file_extension}`,
                base64_representation,
                {
                    cacheControl: '3600',
                    contentType: file.type,
                    upsert: true,
                }
            )

            if (error) {
                console.log("Error found")
                console.log(error);
                throw error
            }

            setAvatarUrl(file.uri)
            onUpload(`${id}.${file_extension}`)
        } catch (error) {
            console.error(error)
        } finally {
            setUploading(false)
        }
    }

    return (
        <View>
            {avatarUrl ? (
                <Image
                    source={{ uri: avatarUrl }}
                    accessibilityLabel="Avatar"
                    style={[avatarSize, styles.avatar, styles.image]}
                />
            ) : (
                <View style={[avatarSize, styles.avatar, styles.noImage]} />
            )}
            <View>
                <Button
                    title={uploading ? 'Uploading ...' : 'Upload'}
                    onPress={uploadAvatar}
                    disabled={uploading}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    avatar: {
        borderRadius: 5,
        overflow: 'hidden',
        maxWidth: '100%',
    },
    image: {
        objectFit: 'cover',
        paddingTop: 0,
    },
    noImage: {
        backgroundColor: '#333',
        border: '1px solid rgb(200, 200, 200)',
        borderRadius: 5,
    },
})