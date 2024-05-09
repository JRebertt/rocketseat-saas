import { z } from 'zod'

export const clientSchema = z.object({
  __typename: z.literal('Client').default('Client'),
  id: z.string(),
  organizationId: z.string(),
})

export type Client = z.infer<typeof clientSchema>

// export const organizationSchema = z.object({
//   __typename: z.literal('Organization').default('Organization'),
//   id: z.string(),
//   role: roleSchema,
//   ownerId: z.string(),
// })
// export type Organization = z.infer<typeof organizationSchema>
