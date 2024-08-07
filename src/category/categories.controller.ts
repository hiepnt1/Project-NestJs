import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CategoryService } from "./categories.service";
import { FindOneParam } from "../utils/findOneParams";
import CreateCategoryDto from "./dto/createCategory.dto";
import UpdateCategoryDto from "./dto/updateCategory.dto";

@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoryService
    ) { }

    @Get()
    getAllCategories() {
        return this.categoriesService.getAllCategories();
    }

    @Get(':id')
    getCategoryById(@Param() { id }: FindOneParam) {
        return this.categoriesService.getCategoryById(Number(id));
    }

    @Post()
    async createCategory(@Body() category: CreateCategoryDto) {
        return;
    }

    @Patch(':id')
    async updateCategory(
        @Param() { id }: FindOneParam,
        @Body() category: UpdateCategoryDto,
    ) {
        return this.categoriesService.updateCategory(Number(id), category);
    }

    @Delete(':id')
    async deleteCategory(@Param() { id }: FindOneParam) {
        return;
    }

}    