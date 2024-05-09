// import fastifyCors from '@fastify/cors'
// import { fastify } from 'fastify'
// import {
//   // jsonSchemaTransform,
//   serializerCompiler,
//   validatorCompiler,
//   ZodTypeProvider,
// } from 'fastify-type-provider-zod'

import { defineAbilityFor } from '@saas/auth'

// const app = fastify().withTypeProvider<ZodTypeProvider>()
// app.setSerializerCompiler(serializerCompiler)
// app.setValidatorCompiler(validatorCompiler)

// app.register(fastifyCors)

// app.listen({ port: 3333 }).then(() => {
//   console.log('Http server runnig ')
// })

const ability = defineAbilityFor({
  role: 'ADMIN',
  id: 'user-1',
  organizationId: 'org-1',
  __typename: 'User',
})

// const client = clientSchema.parse({ id: 'client-1', organizationId: 'org-2' })

console.log(ability.can('transfer_ownership', 'Organization'))
// console.log(ability.can('delete', client))
