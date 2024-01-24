import React from 'react'
import PageWrapper from '@/app/[language]/profile/PageWrapper'
import { getRecipients } from '@/services/account'
import { getCurrencies } from '@/services/currencies'
import Link from 'next/link'
import Image from 'next/image'
import AdminDeliveryForm from '@/app/components/client/DeliveryForm/AdminDeliveryForm'
import { isError } from '@/app/lib/utils'

export const dynamic = 'force-dynamic'

type Props = {
    params: {
        language: string
    }
}

export default async function Page({params: {language}}: Readonly<Props>) {
    const recipientsPromise = getRecipients()
    const currenciesPromise = getCurrencies()
    const [recipientsResponse, currenciesResponse] = await Promise.all([recipientsPromise, currenciesPromise])
    if (isError(recipientsResponse) || isError(currenciesResponse)) {
        return <div>Ошибка</div>
    }

    return (
        <PageWrapper>
            <div className={'md:p-20'}>
                <div className={'hidden md:flex md:flex-row md:align-center md:gap-x-4 mb-10'}>
                    <Link href={'.'} className={'flex justify-center'}>
                        <Image src={'/assets/back_arrow.svg'} alt={'back_arrow.svg'} width={24} height={24}/>
                    </Link>
                    <p className={'md:text-4xl md:font-bold'}>
                        Добавить посылку
                    </p>
                </div>
                <div>
                    <AdminDeliveryForm isUpdate={false} language={language}/>
                </div>
            </div>
        </PageWrapper>
    )
}