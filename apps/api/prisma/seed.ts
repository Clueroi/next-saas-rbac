import { PrismaClient } from '../src/generated/prisma'
import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient({
  log: ['query'],
})

async function seed() {
  await prisma.user.deleteMany()
  await prisma.organization.deleteMany()



  const user = await prisma.user.create({
    data: {
      name: 'jhon doe',
      email: 'johndoe@acme.com',
      avatarUrl: faker.image.avatar(),
      passwordHash: await hash('123456', 1),
    }
  })

  const anotherUser = await prisma.user.create({
    data: {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatar(),
      passwordHash: await hash('123456', 1),
    }
  })


  await prisma.organization.create({
    data: {
      name: 'acme admin',
      domain: 'acme-admin.com',
      slug: 'acme-admin',
      avatarUrl: faker.image.avatar(),
      shouldAttachUsersByDomain: true,
      ownerId: user.id,
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: 'ADMIN',
            },
            {
              userId: anotherUser.id,
              role: 'MEMBER',
            },]
        }
      },
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id
              ]),
            }
          ]
        }
      }
    }
  })

  await prisma.organization.create({
    data: {
      name: 'acme member',
      slug: 'acme-member',
      avatarUrl: faker.image.avatar(),
      shouldAttachUsersByDomain: true,
      ownerId: user.id,
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: 'MEMBER',
            },
            {
              userId: anotherUser.id,
              role: 'ADMIN',
            },]
        }
      },
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id
              ]),
            }
          ]
        }
      }
    }
  })

  await prisma.organization.create({
    data: {
      name: 'acme billing',
      slug: 'acme-billing',
      avatarUrl: faker.image.avatar(),
      shouldAttachUsersByDomain: true,
      ownerId: user.id,
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: 'BILLING',
            },
            {
              userId: anotherUser.id,
              role: 'ADMIN',
            },]
        }
      },
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatar(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUser.id
              ]),
            }
          ]
        }
      }
    }
  })


}

seed().then(() => {
  console.log('Database Seed')
})