import type { AbilityBuilder } from '@casl/ability';
import type { AppAbility } from '.';
import { User } from './models/user';
import type { Project } from './models/project';
import type { Organization } from './models/organization';

type PermissionsByRole = (user: User, builder: AbilityBuilder<AppAbility>) => void;

export const permissions: Record<string, PermissionsByRole> = {
  ADMIN: (_, { can }) => {
    can('manage', 'all');
  },
  MEMBER: (user, { can }) => {
    can(['create', 'get'], 'Project');
    can(['update', 'delete'], 'Project' as const, { ownerId: user.id } as Partial<Project>);
    can('delete', 'Organization' as const, { ownerId: user.id } as Partial<Organization>);
  },
  BILLING: (_, { can }) => {
  }
};
