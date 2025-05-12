
import { z } from 'zod'
import { rolesSchema } from '../roles'

export const userSchema = z.object({
  id: z.string().uuid(),
  role: rolesSchema
})

export type User = z.infer<typeof userSchema>

