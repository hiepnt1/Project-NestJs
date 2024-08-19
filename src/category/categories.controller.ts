import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CategoryService } from "./categories.service";
import { FindOneParam } from "../utils/findOneParams";
import CreateCategoryDto from "./dto/createCategory.dto";
import UpdateCategoryDto from "./dto/updateCategory.dto";
import { JwtAuthGuard } from "../authentication/guard/jwtAuthenticationGuard.guard";

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
    @UseGuards(JwtAuthGuard)
    async createCategory(@Body() category: CreateCategoryDto) {
        return this.categoriesService.createCategory(category);
    }

    @Patch(':id')
    async updateCategory(@Param() { id }: FindOneParam, @Body() category: UpdateCategoryDto) {
        return this.categoriesService.updateCategory(Number(id), category);
    }

    @Delete(':id')
    async deleteCategory(@Param() { id }: FindOneParam) {
        return this.categoriesService.deleteCategory(Number(id));
    }

}    