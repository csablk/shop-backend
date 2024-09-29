import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

dotenv.config();
const prisma = new PrismaClient();

const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const createProducts = async (quantity: number) => {
  for (let i = 0; i < quantity; i++) {
    const productName = faker.commerce.productName();
    const categoryName = faker.commerce.department();
    const categorySlug = faker.helpers.slugify(categoryName).toLowerCase();

    let category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: categoryName,
          slug: categorySlug,
        },
      });
    }

    const product = await prisma.product.create({
      data: {
        name: productName,
        slug: faker.helpers.slugify(productName).toLowerCase(),
        description: faker.commerce.productDescription(),
        price: +faker.commerce.price(),
        images: Array.from({ length: getRandomNumber(2, 6) }).map(() =>
          faker.image.url(),
        ),
        categoryId: category.id,
        reviews: {
          create: {
            rating: getRandomNumber(1, 5),
            text: faker.lorem.sentence(),
            userId: 1,
          },
        },
      },
    });

    console.log(`Created product with ID: ${product.id}`);
  }
};

async function main() {
  console.log('Start seeding...');
  await createProducts(10);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
