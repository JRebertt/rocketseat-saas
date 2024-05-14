import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { User } from './models/user'
import { Role } from './role'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN(user, { can, cannot }) {
    can('manage', 'all')

    cannot(['transfer_ownership', 'update'], 'Organization')
    can(['transfer_ownership', 'update'], 'Organization', {
      ownerId: { $eq: user.id },
    })
  },
  MEMBER(user, { can, cannot }) {
    can('get', 'User')

    can(['create', 'get'], 'Client')
    cannot(['delete', 'update'], 'Client')
    can(['delete', 'update'], 'Client', {
      organizationId: { $eq: user.organizationId },
    })

    cannot(['get'], 'Purchase')
    can(['get'], 'Purchase', { organizationId: { $eq: user.organizationId } })
  },
  BILLING(_, { can }) {
    can('manage', 'Billing')
  },
}
