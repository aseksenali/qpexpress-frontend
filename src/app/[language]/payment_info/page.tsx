import React from 'react'
import { useTranslation } from '@/app/i18n'

export const dynamic = 'force-dynamic'

type Props = {
    params: {
        language: string
    }
}

export default async function Page({params: {language}}: Readonly<Props>) {
    if (language === 'ru') {
        return (
            <div className={'bg-white p-20'}>
                <p className={'text-base'}>
                    <strong>Оплата посылки при получении</strong>
                </p>
                <p className={'text-base'}>
                    Оплата при получении возможна наличными.
                </p>
                <p className={'text-base'}>
                    <strong>Предварительная оплата:</strong>
                </p>
                <p className={'text-base'}>
                    Способы предварительной оплаты:
                </p>
                <p className={'text-base'}>
                    1. Счет на Kaspi
                </p>
                <p className={'text-base'}>
                    2. По системе JetPay
                </p>
                <p className={'text-base'}>
                    Правила оплаты при использовании безналичного расчета устанавливаются следующим образом: покупатель
                    обязан внести сумму заказа в течение 3 (трех) дней с момента выставления счета. Обязательство
                    покупателя по оплате заказа считается выполненным в момент зачисления соответствующих средств на
                    расчетный счет, указанный Продавцом.
                </p>
                <p className={'text-base'}>
                    <strong>Безопасность онлайн-платежей:</strong>
                </p>
                <div>
                    <p className={'text-base'}>
                        Вся предоставленная вами личная информация, такая как адрес электронной почты и номер банковской
                        карты, считается конфиденциальной и не подлежит раскрытию. Данные вашей банковской карты
                        передаются только в зашифрованном виде и не сохраняются Продавцом.
                    </p>
                    <p className={'text-base'}>
                        Безопасность обработки Интернет-платежей обеспечивается платежным сервисом JetPay. Все операции
                        с платежными картами соответствуют требованиям ведущих международных платежных систем (VISA
                        International, MasterCard WorldWide и др). Передача информации происходит с использованием
                        специализированных технологий безопасности для карточных онлайн-платежей, а обработка данных
                        осуществляется на высокотехнологичных серверах платежного сервиса.
                    </p>
                    <p className={'text-base'}>
                        Система авторизации, гарантирует, что реквизиты платежной карты (номер, срок действия,
                        CVV2/CVC2) не попадут в руки мошенников, поскольку эти данные не хранятся в зашифрованном виде
                        на сервере и не могут быть украдены.
                    </p>
                    <p className={'text-base'}>
                        Ввод платежных данных покупателем происходит непосредственно в системе авторизации JetPay, а не
                        на сайте интернет-магазина, что гарантирует их недоступность третьим лицам.
                    </p>
                </div>
            </div>
        )
    } else {
        return (
            <div className={'bg-white p-20'}>
                <p className={'text-base'}>
                    <strong>Cash on delivery</strong>
                </p>
                <p className={'text-base'}>
                    Payment upon receipt is possible in cash.
                </p>
                <p className={'text-base'}>
                    <strong>Prepayment:</strong>
                </p>
                <p className={'text-base'}>
                    Methods of prepayment:
                </p>
                <p className={'text-base'}>
                    1. Invoice via Kaspi
                </p>
                <p className={'text-base'}>
                    2. Using JetPay system
                </p>
                <p className={'text-base'}>
                    Rules for payment when using non-cash settlement are established as follows: the buyer must pay the
                    order amount within 3 (three) days from the invoice date. The buyer&apos;s obligation to pay for the
                    order is considered fulfilled at the moment of crediting the corresponding funds to the Seller&apos;s
                    account.
                </p>
                <p className={'text-base'}>
                    <strong>Security of online payments:</strong>
                </p>
                <div>
                    <p className={'text-base'}>
                        All personal information provided by you, such as email address and bank card number, is
                        considered confidential and is not disclosed. Your bank card data is transmitted only in
                        encrypted form and is not stored by the Seller.
                    </p>
                    <p className={'text-base'}>
                        The security of Internet payments processing is ensured by the payment service JetPay. All
                        operations with payment cards comply with the requirements of leading international payment
                        systems (VISA International, MasterCard WorldWide, etc.). The transfer of information is carried
                        out using specialized security technologies for online card payments, and data processing is
                        performed on high-tech servers of the payment service.
                    </p>
                    <p className={'text-base'}>
                        The authorization system guarantees that the details of the payment card (number, expiration
                        date, CVV2/CVC2) will not fall into the hands of fraudsters, as this data is not stored in
                        encrypted form on the server and cannot be stolen.
                    </p>
                    <p className={'text-base'}>
                        The input of payment data by the buyer is carried out directly in the JetPay authorization
                        system, not on the website of the online store, which guarantees their inaccessibility to third
                        parties.
                    </p>
                </div>
            </div>
        )
    }
}