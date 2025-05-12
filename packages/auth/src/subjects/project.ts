import { z } from 'zod';

export const projectSubject = z.tuple([
  z.union([
    z.literal('create'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('manage'),
  ]),
  z.literal('project'),
])

export type ProjectSubject = z.infer<typeof projectSubject>