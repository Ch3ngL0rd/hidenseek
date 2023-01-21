import React from "react";
import * as Random from 'expo-random';
import { supabase } from "../settings/supabase";
import { User } from "@supabase/supabase-js";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthInterface {
    user: User | null,
    loading: boolean,
    signUp: (email: string, password: string) => void,
    signIn: (email: string, password: string) => void,
    retrieveAccountDetails: () => Promise<{ password: string, email: string }>,
    userData: any | null,
};

const defaultAuth = {
    user: null,
    loading: false,
    userData: null,
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
    const [user, setUser] = React.useState<User | null>(null);
    const [userData, setUserData] = React.useState<any | undefined | null>(null);

    // Authenticates user
    React.useEffect(() => {
        const authenticateUser = async () => {
            const { email, password } = await retrieveAccountDetails()
            try {
                console.log("signing user in");
                await signIn(email, password)
            } catch (e) {
                console.log("signing user up");
                await signUp(email, password);
            }
        }
        const updateUser = async () => {
            setLoading(true);
            const result = await supabase.auth.getUser()
            if (result.data.user === null) {
                await authenticateUser();
            } else {
                setUser(result.data.user);
            }
            setLoading(false);
        }
        updateUser();
    }, [])

    // Retrieves userdata
    React.useEffect(() => {
        if (user === null) {
            return
        }
        const updateUserData = async () => {
            await retrieveUserData(user.id);
        }
        updateUserData();
    }, [user])

    const signIn = async (email: string, password: string) => {
        const result = await supabase.auth.signInWithPassword({
            email, password
        })
        if (result.error) {
            console.log("Error signing user in");
            console.log(result.error.message);
            throw new Error(result.error.message);
        } else {
            setUser(result.data.user);
        }
    }

    const signUp = async (email: string, password: string) => {
        const result = await supabase.auth.signUp({
            email, password
        })
        if (result.error) {
            console.log("Error signing user up");
            console.log(result.error.message);
            throw new Error(result.error.message);
        } else {
            setUser(result.data.user);
        }
    }

    // Returns anonymous account details
    const retrieveAccountDetails = async () => {
        try {
            const password = await AsyncStorage.getItem("password");
            const email = await AsyncStorage.getItem("email");
            // throw new Error("Failed to retrieve account details")
            if (password === null || email === null) {
                throw new Error("Failed to retrieve account details")
            }
            return {
                password,
                email
            }
        } catch (e) {
            const email =
                `${uint8ArrayToHexString(Random.getRandomBytes(10))}@realroyale.com`
            const password = uint8ArrayToHexString(Random.getRandomBytes(10))
            await Promise.all([
                AsyncStorage.setItem("password", password),
                AsyncStorage.setItem("email", email)
            ])
            return {
                password,
                email
            }
        }
    }

    const retrieveUserData = async (userId: string) => {
        let { data: profiles, error } = await supabase
            .from('profiles')
            .select("*")
            .eq('id', userId);

        if (error) {
            throw new Error(error.message);
        } else if (profiles?.length === 0) {
            setUserData(undefined);
        } else {
            setUserData(profiles?.at(0));
        }
    }

    const uint8ArrayToHexString = (arr: Uint8Array): string => {
        return Array.from(arr, (byte: number) => byte.toString(16).padStart(2, '0')).join('');
    }

    return {
        user,
        loading,
        signIn,
        signUp,
        retrieveAccountDetails,
        userData
    } as AuthInterface;
}