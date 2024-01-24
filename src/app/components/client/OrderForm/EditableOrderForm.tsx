'use client'

import React, { FormEvent, useState } from 'react'
import {
    CountryData,
    Errors, FileMetaData,
    GoodFormData,
    OrderFormData,
    RecipientData,
    RecipientOverview,
    SuccessResponse,
} from '@/types'
import MoneyInput from '@/app/components/input/MoneyInput'
import { v4 as uuidv4 } from 'uuid'
import { useImmer } from 'use-immer'
import { useAuthenticationActions } from '@/hooks/client/useAuthenticationActions'
import { useRouter } from 'next/navigation'
import DropdownInput from '@/app/components/input/DropdownInput'
import Input from '@/app/components/input/Input'
import { isError, isSuccess, notEmpty } from '@/app/lib/utils'
import { toast } from 'react-toastify'
import { createOrder } from '@/services/orders'
import FileInput from '@/app/components/input/FileInput'
import CheckboxInput from '@/app/components/input/CheckboxInput'
import { uploadFile } from '@/services/files'

function createDefaultProductInfo(): GoodFormData {
    return {
        id: uuidv4(),
        country: undefined,
        price: undefined,
        trackingNumber: '',
        description: '',
        name: '',
        link: '',
        customOrderId: '',
        invoice: undefined,
        originalBox: false,
    }
}

type Props = {
    countries: CountryData[],
    initialData?: OrderFormData,
    recipients: RecipientData[],
    language: string,
}

export default function EditableOrderForm({initialData, countries, recipients, language}: Readonly<Props>) {
    const [formData, updateFormData] = useImmer<OrderFormData>(initialData ?? {
        recipient: undefined,
        goods: [createDefaultProductInfo()],
    })
    const [errors, setErrors] = useState<Errors>({})
    const {auth} = useAuthenticationActions()
    const router = useRouter()

    const updateProductInfoCallback = <T extends keyof GoodFormData>(index: number, field: T) => (value: GoodFormData[T]) => {
        updateFormData(draft => {
            draft.goods[index][field] = value
        })
    }

    async function submitOrder() {
        const userId = auth.status === 'authenticated' ? auth.session.user.id : undefined
        const recipientId = formData.recipient?.id
        const invoices = formData.goods.map(productInfo => productInfo.invoice)
        const fileResults = await Promise.all(invoices.map(invoice => {
            if (invoice) {
                const form = new FormData()
                form.append('file', invoice)
                return uploadFile(form)
            }
        }))
        if (fileResults.some(response => response ? isError(response) : false)) {
            throw fileResults.filter(notEmpty).reduce((acc, result, index) => {
                if (isError(result)) {
                    return {...acc, [`invoice_${index}`]: [result.error]}
                } else {
                    return acc
                }
            }, {})
        }
        const data = {
            recipientId,
            goods: formData.goods.map((productInfo, index) => {
                return {
                    name: productInfo.name,
                    customOrderId: productInfo.customOrderId,
                    description: productInfo.description,
                    price: productInfo.price!!.value,
                    currencyId: productInfo.price!!.currency.id,
                    invoiceId: (fileResults[index] as SuccessResponse<FileMetaData> | undefined)?.data?.id,
                    countryId: productInfo.country?.id,
                    originalBox: productInfo.originalBox,
                    trackingNumber: productInfo.trackingNumber,
                    link: productInfo.link,
                    recipientId,
                    quantity: 1,
                    userId,
                }
            })
        }
        return await createOrder(data, language)
    }

    const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const promise = submitOrder().then(result => {
            if (isSuccess(result)) {
                return result
            } else {
                setErrors(result.error)
                throw result
            }
        })
        await toast.promise(promise, {
            pending: 'Создание заказа...',
            success: 'Заказ успешно создан',
            error: 'Ошибка при создании заказа',
        })
        router.push('/profile/orders')
    }

    return (
        <form className={'flex flex-col gap-y-10 md:gap-y-10'} onSubmit={onFormSubmit}>
            {
                formData.goods.map((productInfo, index) => {
                    return (
                        <div className={'flex flex-col md:gap-y-5'} key={productInfo.id}>
                            <div className={'flex flex-col md:gap-y-5'}>
                                <p className={'hidden md:block md:text-2xl'}>Информация о товаре</p>
                                <h2 className={'text-xl md:hidden mb-3'}>Информация о товаре</h2>
                                <div className={'flex flex-col gap-y-3'}>
                                    <div className={'flex flex-col md:flex-row gap-y-3 md:gap-x-10'}>
                                        <div
                                            className={'w-[calc(100vw-2.5rem)] md:w-[calc(33%-6rem)] md:basis-1/3 relative'}>
                                            <DropdownInput<CountryData>
                                                id={`country_${index}`}
                                                options={countries}
                                                inputClassname={'border border-black rounded-full p-3 md:p-4 cursor-pointer'}
                                                dropdownClassname={'md:max-h-60 w-[calc(100vw-2.5rem)] z-50 overflow-auto bg-white border md:mx-0 my-3 md:w-full rounded-3xl border-black'}
                                                dropdownItemClassname={'cursor-pointer p-3 w-full text-left md:px-8 md:py-4 border-b border-b-gray hover:bg-gray last:border-0'}
                                                errorsClassname={'absolute top-0 right-0 flex flex-row items-center h-full pr-10 text-[#EF4444]'}
                                                label={'Страна отправления'}
                                                selected={productInfo.country}
                                                setSelected={updateProductInfoCallback(index, 'country')}
                                                getOptionValue={(option) => option.name}
                                                getOptionId={(option) => option.id}
                                                errors={errors}
                                                setErrors={setErrors}
                                                searchable={true} nullable={true}
                                            />
                                        </div>
                                        <div
                                            className={'w-[calc(100vw-2.5rem)] md:w-[calc(33%-6rem)] md:basis-1/3 relative'}>
                                            <Input
                                                id={`custom_order_id_${index}`}
                                                label={'ID заказа'}
                                                inputType={'text'}
                                                disabled={!productInfo.country}
                                                errors={errors}
                                                setErrors={setErrors}
                                                value={productInfo.customOrderId}
                                                wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                                inputClassname={'md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0 required:invalid:border-red-500'}
                                                onChange={(value) => updateProductInfoCallback(index, 'customOrderId')(value)}
                                                required
                                            />
                                        </div>
                                        <div
                                            className={'w-[calc(100vw-2.5rem)] md:w-[calc(33%-6rem)] md:basis-1/3 relative'}>
                                            <Input
                                                id={`tracking_number_${index}`}
                                                label={'Номер трекинга'}
                                                inputType={'text'}
                                                errors={errors}
                                                setErrors={setErrors}
                                                wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                                inputClassname={'md:basis-1/3 md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                                disabled={!productInfo.country}
                                                value={productInfo.trackingNumber}
                                                onChange={(value) => updateProductInfoCallback(index, 'trackingNumber')(value)}
                                            />
                                        </div>
                                    </div>
                                    <Input
                                        id={`link_${index}`}
                                        label={'Ссылка на товар'}
                                        inputType={'text'}
                                        errors={errors}
                                        setErrors={setErrors}
                                        disabled={!productInfo.country}
                                        value={productInfo.link}
                                        wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                        inputClassname={'md:basis-1/3 md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0 invalid:border-red-500'}
                                        onChange={(value) => updateProductInfoCallback(index, 'link')(value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={'flex flex-col gap-y-3 mt-7 md:gap-y-5'}>
                                <p className={'hidden md:block md:text-2xl'}>Декларация</p>
                                <h2 className={'text-xl md:hidden'}>Декларация</h2>
                                <div className={'flex flex-col gap-y-3 md:gap-y-5'}>
                                    <div className={'flex flex-col gap-y-3 md:flex-row md:gap-x-10'}>
                                        <div className={'md:basis-1/3'}>
                                            <Input
                                                id={`name_${index}`}
                                                inputType={'text'}
                                                label={'Наименование'}
                                                errors={errors}
                                                setErrors={setErrors}
                                                wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                                inputClassname={'md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                                value={productInfo.name}
                                                disabled={!productInfo.country}
                                                onChange={(value) => updateProductInfoCallback(index, 'name')(value)}
                                                required
                                            />
                                        </div>
                                        <MoneyInput
                                            id={`price_${index}`}
                                            errors={errors}
                                            setErrors={setErrors}
                                            inputClassname={'md:basis-2/3 p-3 md:p-4 placeholder-black rounded-l-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                            wrapperClassname={'md:basis-1/3 flex flex-row items-center w-full'}
                                            currencyWrapperClassname={'w-1/2 relative'}
                                            currencyInputClassname={'min-w-fit p-3 md:p-4 placeholder-black rounded-r-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                            currencyDropdownClassname={'mt-3 md:mt-5 md:max-h-60 w-full z-50 overflow-auto bg-white border md:mx-0 md:my-4 rounded-3xl border-black'}
                                            currencyItemClassname={'cursor-pointer w-full text-left p-3 md:px-8 md:py-4 border-b border-b-gray hover:bg-gray last:border-0'}
                                            label={'Цена'}
                                            value={productInfo.price}
                                            onChange={updateProductInfoCallback(index, 'price')}
                                            disabled={!productInfo.country}
                                            required
                                        />
                                        <FileInput
                                            id={`invoice_${index}`}
                                            errors={errors}
                                            setErrors={setErrors}
                                            label={'Накладная'}
                                            disabled={!productInfo.country}
                                            file={productInfo.invoice}
                                            wrapperClassname={'md:basis-1/3'}
                                            onChange={updateProductInfoCallback(index, 'invoice')}
                                            inputClassname={'w-full p-3 md:p-4 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0 cursor-pointer text-blue'}
                                        />
                                    </div>
                                    <Input
                                        id={`description_${index}`}
                                        errors={errors}
                                        setErrors={setErrors}
                                        inputType={'text'}
                                        label={'Описание товара'}
                                        wrapperClassname={'relative inline-flex flex-col min-w-0 p-0 w-full'}
                                        inputClassname={'md:p-4 w-full p-3 placeholder-black rounded-full border border-black disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                                        value={productInfo.description}
                                        disabled={!productInfo.country}
                                        onChange={(value) => updateProductInfoCallback(index, 'description')(value)}
                                        required
                                    />
                                </div>
                                <CheckboxInput
                                    id={`original_box_${index}`}
                                    label={'Оставить оригинальную коробку товара'}
                                    disabled={!productInfo.country}
                                    wrapperClassname={'flex items-center gap-x-3 cursor-pointer outline-none w-fit'}
                                    checkboxClassname={'border-none w-6 h-6 outline-none'}
                                    checked={productInfo.originalBox}
                                    onChange={e => updateProductInfoCallback(index, 'originalBox')(e.target.checked)}
                                />
                            </div>
                        </div>
                    )
                })
            }
            <div className={'flex flex-col gap-5 mt-5'}>
                <button className={'border border-blue text-blue w-full p-3 md:p-5 rounded-full'}
                        type={'button'}
                        onClick={() => {
                            updateFormData(draft => {
                                draft.goods.push(createDefaultProductInfo())
                            })
                        }}>
                    + Добавить товар
                </button>
            </div>
            <div className={'flex flex-col gap-5'}>
                <p className={'hidden md:block md:text-2xl'}>Получатель</p>
                <DropdownInput<RecipientOverview>
                    id={'recipient'}
                    options={recipients}
                    errors={errors}
                    setErrors={setErrors}
                    wrapperClassname={'w-[20rem] relative'}
                    inputClassname={'border border-black rounded-full p-3 md:p-4 cursor-pointer disabled:bg-gray-2 disabled:text-light-gray disabled:placeholder-light-gray disabled:cursor-not-allowed disabled:border-0'}
                    dropdownClassname={'md:max-h-60 w-[calc(100vw-2.5rem)] z-50 overflow-auto bg-white border md:mx-0 my-3 md:w-full rounded-3xl border-black'}
                    dropdownItemClassname={'cursor-pointer p-3 w-full text-left md:px-8 md:py-4 border-b border-b-gray hover:bg-gray last:border-0'}
                    errorsClassname={'absolute top-0 right-0 flex flex-row items-center h-full pr-10 text-[#EF4444]'}
                    label={'Получатель'}
                    selected={formData.recipient}
                    setSelected={(value) => updateFormData(draft => {
                        draft.recipient = value
                    })}
                    getOptionValue={(option) => `${option.firstName} ${option.lastName}`}
                    getOptionId={(option) => option.id}
                    searchable={true} nullable={true}/>
            </div>
            <button type={'submit'}
                    className={'cursor-pointer text-white bg-blue p-3 w-full md:py-5 rounded-full md:w-[20rem]'}>
                Добавить
            </button>
        </form>
    )
}