
import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyJwt from "@fastify/jwt";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider
} from "fastify-type-provider-zod";
import { createAccount } from "./routes/auth/createAccount.controller";
import { authenticateWithPassword } from "./routes/auth/authenticate-with-password.controller";
import { getUserProfile } from "./routes/auth/get-profile.controller";
import { errorHandler } from "./error-handler";
import { requestPasswordRecover } from "./routes/auth/request-password-recover.controller";
import { resetPassword } from "./routes/auth/reset-password.controller";
import { authenticateWithGithub } from "./routes/auth/authenticate-with-github.controller";
import { env } from "@acl/env";

const app = fastify().withTypeProvider<ZodTypeProvider>()

//Configurations
app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

// Documentation conguration
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "next-saas",
      description: "Fullstack saas app with multi-tenant & RBAC",
      version: "1.0.0"
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  transform: jsonSchemaTransform
})
app.register(fastifySwaggerUi, {
  routePrefix: '/docs'
}
)

app.setErrorHandler(errorHandler)

// Fastify Configuration
app.register(fastifyJwt, {
  secret: env.JWT_SECERT,

})
app.register(fastifyCors)


//Routes POST
app.register(createAccount)
app.register(authenticateWithPassword)


//Routes GET
app.register(getUserProfile)


//Route to change password and reset
app.register(requestPasswordRecover)
app.register(resetPassword)

//Routes to register with non-created accounts
app.register(authenticateWithGithub)

app.listen({
  port: env.PORT
}).then(() => {
  console.log('Server is running on http://localhost:3333')
})
