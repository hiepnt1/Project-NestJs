import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import CategoryEntity from "./categories.entity";
import { Repository } from "typeorm";
import CategoryNotFoundException from "./exception/categoryNotFound.exception";
import UpdateCategoryDto from "./dto/updateCategory.dto";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoriesRepository: Repository<CategoryEntity>
    ) { }

    getAllCategories() {
        return this.categoriesRepository.find({ relations: ['posts'] });
    }

    async getCategoryById(id: number) {
        const category = await this.categoriesRepository.findOne({ where: { id: id }, relations: ['posts'] });
        if (category) {
            return category;
        }
        throw new CategoryNotFoundException(id);
    }

    async updateCategory(id: number, category: UpdateCategoryDto) {
        await this.categoriesRepository.update(id, category);
        const updatedCategory = await this.categoriesRepository.findOne({ where: { id: id }, relations: ['posts'] });
        if (updatedCategory) {
            return updatedCategory
        }
        throw new CategoryNotFoundException(id);
    }
}