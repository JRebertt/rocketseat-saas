import { api } from './api-client'

interface GetClientsRequest {
  slug: string | null
}

interface GetClientsResponse {
  clients: {
    name: string
    email: string | null
    phoneNumber: string
    birthday: Date | null
    street: string | null
    complement: string | null
    city: string | null
    state: string | null
  }[]
}

export async function getClients({ slug }: GetClientsRequest) {
  const result = await api
    .get(`organizations/${slug}/clients`)
    .json<GetClientsResponse>()

  return result
}
