'use client'

import React, { useCallback, useMemo } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/hooks/client/redux'
import { closeModal, selectModalType } from '@/redux/reducers/modalSlice'
import CalculatorModal from '@/app/components/modal/CalculatorModal'

type Props = {
    width: string,
    children: React.ReactNode,
    type: string,
    onClose?: () => void,
}

export default function Modal() {
    const modalType = useAppSelector(selectModalType)

    const modalWidth = useMemo(() => {
        switch (modalType) {
            case 'calculator':
                return '30rem'
            default:
                return '0'
        }
    }, [modalType])

    return (
        <AnimatePresence>
            {
                modalType && <ModalWrapper width={modalWidth} type={modalType}>
                    {
                        modalType === 'calculator' &&
                        <CalculatorModal/>
                    }
                </ModalWrapper>
            }
        </AnimatePresence>
    )
}

const modalVariants: Variants = {
    initial: {
        opacity: 0,
        y: -100,
    },
    animate: {
        opacity: 1,
        y: 0,
    },
    exit: {
        opacity: 0,
        y: 100,
    },
}

function ModalWrapper({width, onClose, type, children}: Props) {
    const dispatch = useAppDispatch()
    const onCloseClick = useCallback(() => {
        dispatch(closeModal())
        onClose && onClose()
    }, [dispatch, onClose])

    return (
        <motion.div
            key={'background'}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className={'md:w-full md:h-full md:bg-black/50 md:flex md:fixed md:justify-center md:items-center md:z-10 md:left-0 md:top-0'}
            onClick={onCloseClick}>
            <motion.div
                layout
                key={'modal'}
                variants={modalVariants}
                initial={'initial'}
                animate={'animate'}
                exit={'exit'}
                transition={{
                    type: 'spring',
                    duration: .5,
                }}
                style={{width: width}}
                className={'md:absolute md:min-h-[20rem] md:bg-gray md:shadow md:rounded-[2rem] md:border-none'} onClick={event => event.stopPropagation()}>
                <motion.div layout key={type}>
                    <button className={'md:absolute md:cursor-pointer md:bg-none md:text-2xl md:transition-[color] md:duration-[0.2s] md:ease-[ease-in-out] md:border-[none] md:right-8 md:top-8 md:hover:text-black'} onClick={onCloseClick}>
                        <Image src={'/assets/cross.svg'} alt={'cross'} width={20} height={20}/>
                    </button>
                    {children}
                </motion.div>
            </motion.div>
        </motion.div>
    )
}