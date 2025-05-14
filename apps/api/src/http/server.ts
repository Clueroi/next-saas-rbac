
import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider
} from "fastify-type-provider-zod";
import { createAccount } from "./routes/auth/createAccount";

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
app.register(fastifyCors)


//Routes

app.register(createAccount)




app.listen({
  port: 3333
}).then(() => {
  console.log('Server is running on http://localhost:3333')
})
