import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function main() {
  await prisma.post.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // create
  const user = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
      posts: {
        create: { title: 'Hello World' },
      },
      profile: {
        create: { bio: 'I like turtles' },
      },
    },
    include: {
      posts: true,
    }
  });

  // list all users
  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    }
  });
  console.log("> All users:", allUsers);

  let post = user.posts[0];

  // update
  post = await prisma.post.update({
    where: { id: post.id },
    data: { published: true, title: post.title + "-Modified" },
  });
  console.log("> Updated post:", post);

  // delete
  await prisma.post.delete({
    where: { id: post.id },
  });
  console.log("> Deleted post...");

  // list all users
  console.log("> All users:", await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    }
  }));
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  });