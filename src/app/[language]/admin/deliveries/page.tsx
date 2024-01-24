import Link from 'next/link'
import PageWrapper from '@/app/[language]/profile/PageWrapper'
import { getDeliveries } from '@/services/deliveries'
import DeliveriesTable from '@/app/[language]/admin/deliveries/DeliveriesTable'
import { isError } from '@/app/lib/utils'

export const dynamic = 'force-dynamic'

export default async function Page() {
    const deliveriesResponse = await getDeliveries()
    if (isError(deliveriesResponse)) {
        return <div>Ошибка</div>
    }
    const deliveries = deliveriesResponse.data
    return (
        <PageWrapper>
            <div className={'flex flex-col px-5 w-full md:col-start-2 md:col-span-1'}>
                <h2 className={'text-2xl mb-5 md:hidden'}>Посылки</h2>
                <Link href={'/admin/deliveries/create'}>
                    <button
                        className={'border border-blue cursor-pointer w-full text-blue px-0 py-3 rounded-full'}>
                        + Добавить посылку
                    </button>
                </Link>
                <div className={'mt-5 flex flex-col gap-5 md:mt-10'}>
                    <DeliveriesTable deliveries={deliveries} />
                </div>
            </div>
        </PageWrapper>
    )
}