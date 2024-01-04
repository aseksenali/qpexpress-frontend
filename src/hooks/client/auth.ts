'use client'

import { signOut, useSession } from 'next-auth/react'
import { useEffect, useMemo } from 'react'
import { notEmpty } from '@/app/lib/utils'
import { Session } from 'next-auth'
import { useAppDispatch } from '@/hooks/client/redux'

type Roles = { [key: string]: string }

const roleNames: Roles = {
    user: 'Пользователь',
    admin: 'Администратор',
}

type AuthResult = {
    session: Session,
    roles?: string[],
    status: 'authenticated'
} | {
    status: 'unauthenticated' | 'loading'
}

const useAuthorization = (): AuthResult => {
    const {data: session, status} = useSession()
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (status !== 'loading' && session?.error === 'RefreshAccessTokenError') {
            signOut().then()
        }
    }, [dispatch, session, status])
    const roles = useMemo(() => {
        return session?.roles.map(role => {
            if (role in roleNames) {
                return roleNames[role]
            }
        }).filter(notEmpty)
    }, [session?.roles])
    if (status !== 'authenticated') {
        return {status}
    }
    return {roles, session, status}
}

export default useAuthorization