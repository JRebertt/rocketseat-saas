import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middleware/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_error/unauthorized-error'

export async function getActiveCustomers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/metrics/active-customers',
      {
        schema: {
          tags: ['Metrics'],
          summary: 'Get the number of active customers for an organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              activeCustomers: z.number(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)
        if (cannot('get', 'Metrics')) {
          throw new UnauthorizedError(
            'You do not have permission to view metrics.',
          )
        }

        const activeCustomers = await prisma.client.count({
          where: {
            organizationId: organization.id,
            // Define what makes a customer active
            // For example, customers who made a purchase in the last month
            purchases: {
              some: {
                purchaseDate: {
                  gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                },
              },
            },
          },
        })

        return reply.status(200).send({ activeCustomers })
      },
    )
}
