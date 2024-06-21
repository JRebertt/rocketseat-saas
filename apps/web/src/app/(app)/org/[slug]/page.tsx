import { getCurrentOrg } from '@/auth/auth'
import { ActiveCustomersCard } from '@/components/active-customers-card'
import { Header } from '@/components/header'
import { NewCustomersCard } from '@/components/new-customers-card'
import { RevenueByPeriodCard } from '@/components/revenue-by-period-card'
import RevenueChart from '@/components/revenue-chart'
import { TotalCustomersCard } from '@/components/total-customers-card'
import { getClients } from '@/http/get-clients'

export default async function OrganizationsPage() {
  const slug = getCurrentOrg()

  const { clients } = await getClients({ slug })

  console.log(clients)

  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-[1200px]">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-4">
            <TotalCustomersCard slug={slug} />
            <NewCustomersCard slug={slug} />
            <ActiveCustomersCard slug={slug} />
            <RevenueByPeriodCard slug={slug} />
          </div>
          <div className="grid grid-cols-9 gap-4">
            <RevenueChart />
          </div>
        </div>
      </main>
    </div>
  )
}
