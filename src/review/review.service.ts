import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ReviewDto } from './dto/review.dto';
import { returnReviewObject } from './return-review-object';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.review.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: returnReviewObject,
    });
  }

  async create(userId: number, dto: ReviewDto, productId: number) {
    return this.prisma.review.create({
      data: {
        ...dto,
        Product: {
          connect: {
            id: productId,
          },
        },
        User: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async getAverageValueByProductId(productId: number) {
    return this.prisma.review
      .aggregate({
        where: {
          productId,
        },
        _avg: {
          rating: true,
        },
      })
      .then((data) => data._avg);
  }

  async delete(id: number) {
    return this.prisma.review.delete({
      where: {
        id,
      },
    });
  }
}
