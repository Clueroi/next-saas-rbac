import { ability } from '@acl/auth'

const userCanInviteSomeoneElse = ability.can('invite', 'User')
