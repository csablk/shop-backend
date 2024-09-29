import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  productReturnObject,
  productReturnObjectFullest,
} from './return-product-object';
import { ProductDto } from './dto/product-dto';
import { faker } from '@faker-js/faker';
import { GetAllProductDto, ProductSort } from './dto/get-all-product.dto';
import { PaginationService } from 'src/pagination/pagination.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async getAll(dto: GetAllProductDto = {}) {
    const { sort, searchTerm } = dto;

    const prismaSort: Prisma.ProductOrderByWithRelationInput[] = [];

    if (sort === ProductSort.LOW_PRICE) {
      prismaSort.push({ price: 'asc' });
    } else if (sort === ProductSort.HIGH_PRICE) {
      prismaSort.push({ price: 'desc' });
    } else if (sort === ProductSort.NEWEST) {
      prismaSort.push({ createdAt: 'desc' });
    } else if (sort === ProductSort.OLDEST) {
      prismaSort.push({ createdAt: 'asc' });
    }

    const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
      ? {
          OR: [
            {
              Category: {
                name: { contains: searchTerm, mode: 'insensitive' },
              },
            },
            {
              name: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {};

    const { perPage, skip } = this.paginationService.getPagination(dto);

    const products = await this.prisma.product.findMany({
      where: prismaSearchTermFilter,
      orderBy: prismaSort,
      skip,
      take: perPage,
    });

    const totalCount = await this.prisma.product.count({
      where: prismaSearchTermFilter,
    });

    return { products, length: totalCount };
  }

  async byId(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      select: productReturnObjectFullest,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async bySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      select: productReturnObjectFullest,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async byCategory(categorySlug: string) {
    const products = await this.prisma.product.findMany({
      where: {
        Category: {
          slug: categorySlug,
        },
      },
      select: productReturnObjectFullest,
    });

    if (!products) {
      throw new NotFoundException('Product not found');
    }

    return products;
  }

  async getSimilar(id: number) {
    const currentProduct = await this.byId(id);

    if (!currentProduct) {
      throw new NotFoundException('Current product not found');
    }

    const products = await this.prisma.product.findMany({
      where: {
        Category: {
          name: currentProduct.Category.name,
        },
        NOT: {
          id: currentProduct.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: productReturnObject,
    });

    return products;
  }

  async create() {
    const product = await this.prisma.product.create({
      data: {
        description: '',
        name: '',
        price: 0,
        slug: '',
      },
    });

    return product.id;
  }

  async update(id: number, dto: ProductDto) {
    const { description, images, price, name, categoryId } = dto;

    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        description,
        images,
        price,
        name,
        slug: faker.helpers.slugify(name).toLowerCase().toLowerCase(),
        Category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
  }
}
