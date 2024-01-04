import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from '@/app/i18n'

type Props = {
    language: string
}

export default async function Footer({language}: Props) {
    const {t} = await useTranslation(language, 'footer')
    return (
        <div className={'w-full flex flex-col gap-y-6 md:gap-y-12 bg-black text-white p-5 md:p-20'}>
            <div className={'flex flex-col gap-y-4'}>
                <p className={'text-[0.9rem]'}>{t('phone_number')}: +7 (700) 088-80-90</p>
                <p className={'text-[0.9rem]'}>Адрес: Казахстан, г. Алматы, Алмалинский район, ул. Карасай батыра, д.
                    180, кв. 76, 050008</p>
                <p className={'text-[0.9rem]'}>Email:&nbsp;
                    <a href={'mailto://qpexpresskz@gmail.com'}>
                        qpexpresskz@gmail.com
                    </a>
                </p>
            </div>
            <hr className={'w-full border border-white hidden md:block'}/>
            <div className={'flex flex-col md:flex-row justify-between items-center gap-4'}>
                <p className={'text-[0.9rem] order-last md:order-first'}>2023 @ QP Express</p>
                <div className={'relative w-12 h-12'}>
                    <Link href={'https://instagram.com/qp_express'} target={'_blank'} className={'w-full h-full'}>
                        <Image src={'/assets/instagram.svg'} alt={'instagram'} fill/>
                    </Link>
                </div>
            </div>
        </div>
    )
}