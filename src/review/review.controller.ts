import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewDto } from './dto/review.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async getAll() {
    return this.reviewService.getAll();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post(':productId')
  async create(
    @CurrentUser('id') id: number,
    @Body() dto: ReviewDto,
    @Param('productId') productId: string,
  ) {
    return this.reviewService.create(id, dto, +productId);
  }

  @Get('average/:productId  ')
  async getAverageValueByProductId(@Param('productId') productId: number) {
    return this.reviewService.getAverageValueByProductId(productId);
  }

  @HttpCode(204)
  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.reviewService.delete(id);
  }
}
