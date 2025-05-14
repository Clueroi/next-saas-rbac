
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

// Fastify Configuration
app.register(fastifyJwt, {
  secret: 'my-jwt-secret',
  
})
app.register(fastifyCors)


//Routes

app.register(createAccount)
app.register(authenticateWithPassword)



app.listen({
  port: 3333
}).then(() => {
  console.log('Server is running on http://localhost:3333')
})
