import { z } from 'zod'

import { roleSchema } from '../role'

export const organizationSchema = z.object({
  __typename: z.literal('Organization').default('Organization'),
  id: z.string(),
  role: roleSchema,
  ownerId: z.string(),
})
export type Organization = z.infer<typeof organizationSchema>
