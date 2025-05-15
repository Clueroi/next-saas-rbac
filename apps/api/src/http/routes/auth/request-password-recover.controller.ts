import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { auth } from "@/http/middlewares/auth";


export async function requestPasswordRecover(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).post('/password/recover',
    {
      schema: {
        tags: ['auth'],
        summary: 'Recover password',
        body: z.object({
          email: z.string().email()
        }),
        response: {
          201: z.null()
        }
      }
    },
    async (request, reply) => {
      const { email } = request.body

      const userFromEmail = await prisma.user.findUnique({
        where: {
          email
        }
      })

      //We don't want to expose if the email is not registered
      if (!userFromEmail) {
        return reply.status(201).send()
      }

      const { id: code } = await prisma.token.create({
        data: {
          type: 'PASSWORD_RECOVER',
          userId: userFromEmail.id,
        }
      })

      
      //send e-mail with password recover
      console.log('Recover code:', { code })

      return reply.status(200).send()
    })
}