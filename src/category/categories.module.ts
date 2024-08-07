import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import CategoryEntity from './categories.entity';
import { CategoriesController } from './categories.controller';
import { CategoryService } from './categories.service';

@Module({
    imports: [TypeOrmModule.forFeature([CategoryEntity])],
    controllers: [CategoriesController],
    providers: [CategoryService],
})
export class CategoriesModule { }