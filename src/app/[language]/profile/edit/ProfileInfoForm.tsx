'use client'

import Input from '@/app/components/input/Input'
import React, { useState } from 'react'
import { useTranslation } from '@/app/i18n/client'
import { updateAccount } from '@/services/account'
import { Errors, ProfileData } from '@/types'
import { toast } from 'react-toastify'
import { isSuccess } from '@/app/lib/utils'

export type FormData = {
    firstName: string
    lastName: string
    patronymic: string
    email: string
}

type Props = {
    initialFormData?: ProfileData
    language: string
}

export default function ProfileInfoForm({initialFormData, language}: Readonly<Props>) {
    const {t} = useTranslation(language, 'profile')
    const [isEditing, setIsEditing] = useState(false)
    const [errors, setErrors] = useState<Errors>({})
    const [formData, setFormData] = useState<FormData>(initialFormData ?? {
        firstName: '',
        lastName: '',
        patronymic: '',
        email: '',
    })

    async function onProfileUpdate(data: FormData) {
        await toast.promise(updateAccount(data, language).then(
            response => {
                if (isSuccess(response)) {
                    return response.data
                } else {
                    throw response.error
                }
            },
        ), {
            pending: t('edit_profile.saving_profile'),
            success: t('edit_profile.saved_profile'),
            error: t('edit_profile.error_saving_profile'),
        }).then(_ => {
            setIsEditing(false)
        }).catch(err => {
            setErrors(err as Errors)
        })
    }

    return (
        <form className={'flex flex-col gap-y-4 md:gap-y-10'}>
            <h3 className={'text-2xl font-bold md:hidden'}>
                {t('edit_profile.my_personal_info')}
            </h3>
            <h3 className={'text-xl font-bold md:hidden'}>
                {t('edit_profile.personal_info')}
            </h3>
            <div className={'flex flex-col gap-y-4 md:flex-row md:gap-y-5 md:gap-x-6 md:flex-wrap'}>
                <div className={'md:w-[calc(50%-0.75rem)] w-full'}>
                    <Input
                        id={'first_name'}
                        name={'first_name'}
                        inputType={'text'}
                        errors={errors}
                        setErrors={setErrors}
                        wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                        inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                        value={formData.firstName}
                        onChange={(value) => setFormData({
                            ...formData,
                            firstName: value,
                        })}
                        label={t('edit_profile.first_name')} readOnly={!isEditing} required/>
                </div>
                <div className={'md:w-[calc(50%-0.75rem)] w-full'}>
                    <Input
                        id={'last_name'}
                        name={'last_name'}
                        inputType={'text'}
                        errors={errors}
                        setErrors={setErrors}
                        wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                        inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                        value={formData.lastName}
                        onChange={(value) => setFormData({
                            ...formData,
                            lastName: value,
                        })}
                        label={t('edit_profile.last_name')} readOnly={!isEditing} required/>
                </div>
                <div className={'md:w-[calc(50%-0.75rem)] w-full'}>
                    <Input
                        id={'patronymic'}
                        name={'patronymic'}
                        inputType={'text'}
                        errors={errors}
                        setErrors={setErrors}
                        wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                        inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                        value={formData.patronymic}
                        onChange={(value) => setFormData({
                            ...formData,
                            patronymic: value,
                        })}
                        label={t('edit_profile.patronymic')} readOnly={!isEditing}/>
                </div>
                <div className={'md:w-[calc(50%-0.75rem)] w-full'}>
                    <Input
                        id={'email'}
                        name={'email'}
                        inputType={'text'}
                        errors={errors}
                        setErrors={setErrors}
                        wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                        inputClassname={'md:p-5 p-3 border rounded-full border-black placeholder:text-black w-full'}
                        value={formData.email}
                        onChange={(value) => setFormData({
                            ...formData,
                            email: value,
                        })}
                        label={t('edit_profile.email')} readOnly={!isEditing} required/>
                </div>
            </div>
            {
                isEditing ? (
                    <button
                        className={'cursor-pointer text-white bg-blue md:py-5 rounded-full md:w-[20rem] w-full p-3'}
                        type={'button'}
                        onClick={() => onProfileUpdate(formData)}
                    >
                        {t('edit_profile.save')}
                    </button>
                ) : (
                    <button
                        className={'cursor-pointer text-white bg-blue md:py-5 rounded-full md:w-[20rem] w-full p-3'}
                        onClick={() => setIsEditing(true)}
                        type={'button'}
                    >
                        {t('edit_profile.change')}
                    </button>
                )
            }
        </form>
    )
}