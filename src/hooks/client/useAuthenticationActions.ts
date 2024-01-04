import { useRouter } from 'next/navigation'
import useAuthorization from '@/hooks/client/auth'
import { useCallback, useMemo } from 'react'
import { signIn, signOut } from 'next-auth/react'
import { AUTH_URL, FRONTEND_URL } from '@/globals'

export const useAuthenticationActions = () => {
    const router = useRouter()
    const auth = useAuthorization()
    const onLoginClick = useCallback(async () => {
        await signIn('keycloak', {
            redirect: false,
            callbackUrl: FRONTEND_URL,
        })
    }, [])
    const idToken = useMemo(() => {
        if (auth?.status === 'authenticated')
            return auth?.session?.idToken
        return undefined
    }, [auth])
    const onSignUpClick = useCallback(() => {
        if (FRONTEND_URL) {
            router.push(`${AUTH_URL}/realms/QPExpress/protocol/openid-connect/registrations?client_id=react-app&response_type=code&scope=openid+email&redirect_uri=${encodeURI(FRONTEND_URL)}&ui_locale=`)
        }
    }, [router])
    const onSignOutClick = useCallback(async () => {
        if (auth.status === 'authenticated') {
            await signOut({
                callbackUrl: `/api/auth/logout/${idToken}`,
            })
        }
    }, [auth.status, idToken])
    return {
        auth,
        onLoginClick,
        onSignUpClick,
        onSignOutClick,
    }
}