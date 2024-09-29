import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CategoryDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: CategoryDto) {
    return this.categoryService.update(+id, dto);
  }

  @HttpCode(200)
  @Auth()
  @Post()
  async create() {
    return this.categoryService.create();
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.categoryService.delete(+id);
  }

  @Get()
  async getAll() {
    return this.categoryService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.categoryService.byId(+id);
  }

  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.categoryService.bySlug(slug);
  }
}
