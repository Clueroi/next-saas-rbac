import type { AbilityBuilder } from '@casl/ability';
import type { AppAbility } from '.';
import { User } from './models/user';
import { Role } from './roles';

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
 ) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN: (user, { can, cannot }) => {

  },
  MEMBER: (user, { can }) => {
  },
  BILLING: (_, { can }) => {
  }
};
