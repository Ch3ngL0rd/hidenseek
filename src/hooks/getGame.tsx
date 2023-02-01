import React from "react";
import { supabase } from "../settings/supabase";

interface GameInterface {
    code: string,
    created_at: string,
    creator: {
        username: string
    },
    game_length: number,
    id: number,
    name: string,
    start_time: string | null,
}

const gameContext = React.createContext<any>(undefined);

// Wrapper with Authentication Contenxt
export const GameProvider = ({ children }: { children: React.ReactNode }) => {
    const game = getGame();
    return <gameContext.Provider value={game}>{children}</gameContext.Provider>
}

export const useGame = () => {
    return React.useContext(gameContext);
}

const getGame = () => {
    const [game_id, setGameID] = React.useState<number | undefined>(undefined)
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);
    // Undefined while loading, null if not found, GameInterface if found
    const [game, setGame] = React.useState<GameInterface | null | undefined>(undefined);

    React.useEffect(() => {
        if (!game_id) { return }
        setLoading(true)
        const game = supabase
            .from("games")
            .select(`
                *,
                creator (username)
            `)
            .eq("id", game_id)
            .single()
            .then(
                (res) => {
                    console.log(res);
                    if (res.error) {
                        console.log(res.error);
                        setError(res.error.message)
                    } else {
                        setGame(res.data)
                    }
                    setLoading(false)
                }
            )
        const game_update = supabase.channel('custom-all-channel')
            .on(
                'postgres_changes',
                {
                    event: '*', schema: 'public', table: 'games',
                    filter: `id = ${game_id}`
                },
                (payload) => {
                    console.log('Change received!', payload)
                    if (payload.new) { setGame(payload.new) }
                }
            )
            .subscribe()
        return () => {
            game_update.unsubscribe()
        }
    }, [game_id])

    const joinGame = (game_id: number) => {
        setGameID(game_id)
    }


    return {
        game,
        error,
        loading,
        joinGame
    }
}