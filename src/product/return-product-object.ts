import { Prisma } from '@prisma/client';
import { returnCategoryObject } from 'src/category/return-category-object';
import { returnUserObject } from 'src/user/return-user-object';

export const productReturnObject: Prisma.ProductSelect = {
  images: true,
  description: true,
  id: true,
  name: true,
  price: true,
  createdAt: true,
  slug: true,
};

export const productReturnObjectFullest: Prisma.ProductSelect = {
  ...productReturnObject,
  reviews: {
    select: {
      id: true,
      createdAt: true,
      text: true,
      rating: true,
      User: {
        select: {
          ...returnUserObject,
        },
      },
    },
  },
  Category: {
    select: {
      ...returnCategoryObject,
    },
  },
};
