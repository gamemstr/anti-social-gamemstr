import { useState } from "react";
import { Button } from "./ui/button";
import { CardContent } from "./ui/card";
import { createClient } from "@/lib/supabase/client";
import { SiRefinedgithub, SiGoogle } from "@icons-pack/react-simple-icons";

export default function ProviderLogin() {
    return (
        <CardContent className="flex flex-col gap-2">
            <Provider params={{provider: 'github'}} />
            <Provider params={{provider: 'google'}} />
        </CardContent>
    )
}

export function Provider({params}: {params: { provider: 'github' | 'google' }}) {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    
    const handleProviderLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        const supabase = createClient()
        setIsLoading(true)
        setError(null)

        try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: params.provider,
            options: {
            redirectTo: `${window.location.origin}/auth/oauth?next=/protected`,
            },
        })

        if (error) throw error
        } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'An error occurred')
        setIsLoading(false)
        }
    }

    const iconMap = {
        github: SiRefinedgithub,
        google: SiGoogle,
    }

    const Icon = iconMap[params.provider];

    const properNameMap = {
        github: 'GitHub',
        google: 'Google',
    }

    const properName = properNameMap[params.provider];

    return (
        <form onSubmit={handleProviderLogin}>
            <div className="flex flex-col gap-6">
                {error && <p className="text-sm text-destructive-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                <Icon /> {isLoading ? 'Logging in...' : `Continue with ${properName}`}
                </Button>
            </div>
        </form>
    )
}