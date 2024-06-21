import { UserPlus } from 'lucide-react'

import { getNewCustomers } from '@/http/metrics-api-client'

import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface Props {
  slug: string | null
}
export async function NewCustomersCard({ slug }: Props) {
  const { newCustomers } = await getNewCustomers({ slug })
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Novos Clientes
        </CardTitle>
        <UserPlus className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        <span className="text-2xl font-bold tracking-tight">
          {newCustomers}
        </span>
      </CardContent>
    </Card>
  )
}
