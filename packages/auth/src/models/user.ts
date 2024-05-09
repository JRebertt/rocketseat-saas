import { z } from 'zod'

import { roleSchema } from '../role'

export const userSchema = z.object({
  __typename: z.literal('User').default('User'),
  id: z.string(),
  role: roleSchema,
  organizationId: z.string(),
})
export type User = z.infer<typeof userSchema>
