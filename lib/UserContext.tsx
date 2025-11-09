'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { CustomUser, CustomSupabaseJwtPayload } from "./utils";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createClient } from "./supabase/client";
import { jwtDecode } from "jwt-decode";

const UserContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [userLoaded, setUserLoaded] = useState(false);
    const [user, setUser] = useState<CustomUser | null>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        function saveSession(session: Session | null) {
            const currentUser = session?.user as CustomUser | null;

            if (session && currentUser) {
                const jwt = jwtDecode<CustomSupabaseJwtPayload>(session.access_token);
                currentUser.appRole = jwt.user_role;
            }
            setUser(currentUser);
            setUserLoaded(!!currentUser);
            if(currentUser) {
                router.push("/protected");
            }
        }

        supabase.auth.getSession().then(({ data: { session } }) => saveSession(session));

        const {data: { subscription }} = supabase.auth.onAuthStateChange(
        async (event, session) => {
            console.log(session);
            saveSession(session);
        }
        );
        
        return () => {
        subscription.unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, userLoaded }}>
            {children}
        </UserContext.Provider>
    );
}

export const useAuth = () => useContext(UserContext);