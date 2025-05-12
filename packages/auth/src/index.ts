import { createMongoAbility, CreateAbility, MongoAbility, AbilityBuilder } from '@casl/ability';
import { User } from './models/user';
import { permissions } from './permissions';
import { z } from 'zod';

//Subjects
import { userSubject } from './subjects/user';
import { projectSubject } from './subjects/project';
import { inviteSubject } from './subjects/invite';
import { organizationSubject } from './subjects/organization';
import { billingSubject } from './subjects/billing';


export type Subjects = 'User' | 'Project';

// export type AppAbilities = UserSubject | ProjectSubject | InviteSubject | OrganizationSubject | BillingSubject | ['manage', 'all']

const appAbilitiesSchema = z.union([
  projectSubject,
  userSubject,
  inviteSubject,
  organizationSubject,
  billingSubject,

  z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof appAbilitiesSchema>


export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`No permissions defined for role: ${user.role}`);
  }

  permissions[user.role](user, builder)

  const ability = builder.build({
    detectSubjectType(subject){
      return subject.__typename
    }
  })

  return ability
}