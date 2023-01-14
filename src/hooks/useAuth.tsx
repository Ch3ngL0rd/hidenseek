import React from "react";
import { supabase } from "../settings/supabase";
import { User } from "@supabase/supabase-js";

interface AuthInterface {
    user: User | null,
    loading: boolean,
};

const defaultAuth = {
    user: null,
    loading: false,
} as AuthInterface;

const authContext = React.createContext<AuthInterface>(defaultAuth);

// Wrapper with Authentication Contenxt
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
    return React.useContext(authContext);
}

const useProvideAuth = (): AuthInterface => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [user, setUser] = React.useState<any>(null);

    const updateUser = async () => {
        setLoading(true);
        const result = await supabase.auth.getUser();
        if (result.error) {
            console.log(result.error);
        } else {
            setUser(result.data.user);
        }
        setLoading(false);
    }

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        const result = await supabase.auth.signInWithPassword({
            email, password
        })
        if (result.error) {
            console.log(result.error);
        } else {
            setUser(result.data.user);
        }
        setLoading(false);
    }

    return {
        user,
        loading,
    } as AuthInterface;
}