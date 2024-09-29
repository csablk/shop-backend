import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { GetAllProductDto } from './dto/get-all-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes(new ValidationPipe())
  @Get('similar/:id')
  async getSimilar(@Param('id') id: string) {
    return this.productService.getSimilar(+id);
  }

  @Get('slug/:slug')
  async getProductBySlug(@Param('slug') slug: string) {
    const product = await this.productService.bySlug(slug);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  @Get('category/:slug')
  async getProductsByCategory(@Param('slug') categorySlug: string) {
    return this.productService.byCategory(categorySlug);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.byId(+id);
  }

  @Get()
  async getAll(@Query() dto: GetAllProductDto) {
    return this.productService.getAll(dto);
  }
}
