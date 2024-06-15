import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middleware/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_error/unauthorized-error'

export async function getAllPurchases(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/purchases',
      {
        schema: {
          tags: ['Purchases'],
          summary: 'Get all purchases for an organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.array(
              z.object({
                id: z.string(),
                service: z.string(),
                paymentMethod: z.string(),
                purchaseAmount: z.number(),
                purchaseDate: z.date(),
                description: z.string().nullable(),
                // clientId: z.string(),
                clientName: z.string(),
              }),
            ),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Purchase')) {
          throw new UnauthorizedError(
            `You do not have permission to view purchases.`,
          )
        }

        const purchases = await prisma.purchase.findMany({
          where: {
            client: {
              organization: {
                slug,
              },
            },
          },
          select: {
            id: true,
            service: true,
            paymentMethod: true,
            purchaseAmount: true,
            purchaseDate: true,
            description: true,
            // clientId: true,
            client: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            purchaseDate: 'desc',
          },
        })

        const purchasesWithClientInfo = purchases.map((purchase) => ({
          id: purchase.id,
          service: purchase.service,
          paymentMethod: purchase.paymentMethod,
          purchaseAmount: purchase.purchaseAmount,
          purchaseDate: purchase.purchaseDate,
          description: purchase.description,
          // clientId: purchase.clientId,
          clientName: purchase.client.name,
        }))

        return reply.status(200).send(purchasesWithClientInfo)
      },
    )
}
