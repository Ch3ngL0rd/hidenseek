import React from "react";
import { supabase } from "../settings/supabase";

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

export const getPlayers = (game_id: number) => {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);
    // Undefined while loading, null if not found, GameInterface if found
    const [players, setPlayers] = React.useState<Profile[]>([]);

    // Gets a live list of which players are in the game
    React.useEffect(() => {
        setLoading(true);
        // gets list of players and joins to their profile
        supabase
            .from("players")
            .select(`
                *,
                profile_id (id, name, username, avatar)
            `)
            .eq("game_id", game_id)
            .then((res) => {
                if (res.error) {
                    setError(res.error.message);
                } else {
                    setPlayers(res.data.map((player) => player.profile_id));
                }
                setLoading(false);
            });


        supabase.channel('players-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'players' },
                async (payload) => {
                    // gets profile
                    console.log("update", payload)
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


    return {
        players,
        error,
        loading
    }
}