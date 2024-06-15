import { z } from 'zod'

import { roleSchema } from '../roles'

export const userSchema = z.object({
  __typename: z.literal('User').default('User'),
  id: z.string(),
  role: roleSchema,
  organizationId: z.string().optional(),
})
export type User = z.infer<typeof userSchema>
