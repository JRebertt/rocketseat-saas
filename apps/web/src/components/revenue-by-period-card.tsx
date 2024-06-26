import { DollarSign } from 'lucide-react'

import { getRevenueByPeriod } from '@/http/metrics-api-client'

import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface Props {
  slug: string | null
}

export async function RevenueByPeriodCard({ slug }: Props) {
  const { totalRevenue, period } = await getRevenueByPeriod({ slug })
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Receita ({period === 'month' ? 'Mês' : 'Semana'})
        </CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        <span className="text-2xl font-bold tracking-tight">
          {totalRevenue.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </span>
      </CardContent>
    </Card>
  )
}
