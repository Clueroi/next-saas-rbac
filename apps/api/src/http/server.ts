
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

const app = fastify().withTypeProvider<ZodTypeProvider>()

//Configurations
app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "next-saas",
      description: "Fullstack saas app with multi-tenant & RBAC",
      version: "1.0.0"
    },
    servers: [],
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
  secret: 'my-jwt-secret',

})
app.register(fastifyCors)


//Routes POST
app.register(createAccount)
app.register(authenticateWithPassword)


//Routes GET
app.register(getUserProfile)


//Route to change password
app.register(requestPasswordRecover)

app.listen({
  port: 3333
}).then(() => {
  console.log('Server is running on http://localhost:3333')
})
