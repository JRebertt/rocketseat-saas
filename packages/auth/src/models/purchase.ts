import { z } from 'zod'

export const purchaseSchema = z.object({
  __typename: z.literal('Purchase').default('Purchase'),
  organizationId: z.string(),
})

export type Purchase = z.infer<typeof purchaseSchema>
