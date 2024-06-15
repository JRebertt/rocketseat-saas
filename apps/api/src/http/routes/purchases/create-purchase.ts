import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middleware/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_error/bad-request-error'
import { UnauthorizedError } from '../_error/unauthorized-error'

export async function createPurchase(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/clients/:clientId/purchases',
      {
        schema: {
          tags: ['Purchases'],
          summary: 'Create a new purchase',
          security: [{ bearerAuth: [] }],
          body: z.object({
            service: z.string().min(1),
            paymentMethod: z.string().min(1),
            purchaseAmount: z.number().positive(),
            purchaseDate: z.coerce.date(),
            description: z.string().nullable(),
          }),
          params: z.object({
            slug: z.string(),
            clientId: z.string(),
          }),
          response: {
            201: z.object({
              id: z.string(),
              service: z.string(),
              paymentMethod: z.string(),
              purchaseAmount: z.number(),
              purchaseDate: z.date(),
              description: z.string().nullable(),
              clientId: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug, clientId } = request.params
        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Purchase')) {
          throw new UnauthorizedError(
            `You do not have permission to create purchases.`,
          )
        }

        // Verificar se o cliente pertence à organização usando o slug
        const client = await prisma.client.findFirst({
          where: {
            id: clientId,
            organization: {
              slug,
            },
          },
        })

        if (!client) {
          throw new BadRequestError('Client not found in this organization.')
        }

        const {
          service,
          paymentMethod,
          purchaseAmount,
          purchaseDate,
          description,
        } = request.body

        const purchase = await prisma.purchase.create({
          data: {
            service,
            paymentMethod,
            purchaseAmount,
            purchaseDate,
            description,
            clientId,
          },
        })

        return reply.status(201).send(purchase)
      },
    )
}
