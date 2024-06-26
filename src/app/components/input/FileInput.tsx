'use client'

import React, { Dispatch, DragEvent, SetStateAction, useRef, useState } from 'react'
import Image from 'next/image'
import { Errors, FileMetaData } from '@/types'
import clsx from 'clsx'
import Link from 'next/link'
import { BACKEND_URL } from '@/globals'
import TextInput from '@/app/components/input/TextInput'
import { animated, useSpring } from '@react-spring/web'

type Props = {
    id: string
    label?: string
    inputClassname?: string
    wrapperClassname?: string
    errors?: Errors
    setErrors?: Dispatch<SetStateAction<Errors>>
    onChange?: (file?: File) => void
    disabled?: boolean
    fileTypes?: string[]
    readOnly?: boolean
    file?: File | FileMetaData
    name?: string
    required?: boolean
}

export default function FileInput({
                                      label,
                                      wrapperClassname,
                                      inputClassname,
                                      errors,
                                      setErrors,
                                      onChange,
                                      disabled,
                                      fileTypes,
                                      file,
                                      readOnly,
                                      name,
                                      id,
                                      required,
                                  }: Readonly<Props>) {
    const fileName = file ? file.name : ''
    const [statusText, setStatusText] = useState<string>()
    const inputRef = useRef<HTMLInputElement>(null)
    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setStatusText('Отпустите, чтобы загрузить файл')
    }

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setStatusText(undefined)
        if (event.dataTransfer.files?.[0]) {
            onChange?.(event.dataTransfer.files[0])
        }
    }

    const iconVariants = {
        'initial': {
            opacity: 1,
            scale: 1,
        },
        'changed': {
            opacity: 0,
            scale: 0,
            display: 'none',
        },
    }

    return (
        <div className={clsx('relative', wrapperClassname)}>
            <div onClick={() => {
                if (!readOnly)
                    inputRef.current?.click()
            }}
                 onDragOver={handleDragOver}
                 onDrop={handleDrop}>
                <TextInput
                    id={id}
                    type={'text'}
                    className={inputClassname}
                    errors={errors}
                    setErrors={setErrors}
                    label={label ? (
                        <div className={'flex flex-row items-center'}>
                            <div>
                                <Image src={'/assets/file_upload.svg'} alt={'file_upload'} width={15} height={15}
                                       className={'mr-2'}/>
                            </div>
                            <span className={'text-blue'}>
                                {statusText ?? label + (required ? '*' : '')}
                            </span>
                        </div>
                    ) : ''}
                    value={fileName}
                    inputColor={'#00A7FF'}
                    disabled={disabled}
                    readOnly/>
                <input type={'file'}
                       ref={inputRef}
                       accept={fileTypes?.join(',') ?? '*'}
                       onChange={({target: {files}}) => {
                           if (files?.[0]) {
                               onChange?.(files[0])
                           }
                       }}
                       name={name}
                       readOnly={readOnly}
                       hidden/>
            </div>
            {
                file && (
                    <div
                        className={'absolute right-5 top-1/2 translate-y-[-50%] flex flex-row gap-3 items-center h-full'}>
                        {
                            'id' in file && (
                                <Link href={`${BACKEND_URL}/v1/files/${file.id}/download`}
                                      target={'_blank'}>
                                    <Image src={'/assets/download.svg'} alt={'download'} width={15} height={15}/>
                                </Link>
                            )
                        }
                        {
                            !readOnly && (
                                <button type={'button'} onClick={() => {
                                    onChange?.(undefined)
                                }}>
                                    <Image src={'/assets/cross.svg'} alt={'close'} width={15} height={15}/>
                                </button>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}