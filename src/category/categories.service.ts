import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import CategoryEntity from "./categories.entity";
import { Repository } from "typeorm";
import CategoryNotFoundException from "./exception/categoryNotFound.exception";
import UpdateCategoryDto from "./dto/updateCategory.dto";
import CreateCategoryDto from "./dto/createCategory.dto";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoriesRepository: Repository<CategoryEntity>
    ) { }

    async getAllCategories() {
        return await this.categoriesRepository.find();
    }

    async createCategory(category: CreateCategoryDto) {
        const newCate = await this.categoriesRepository.create(category);
        await this.categoriesRepository.save(newCate)
        return newCate;
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

    async deleteCategory(id: number) {
        const deleteResponse = await this.categoriesRepository.delete(id);
        if (!deleteResponse.affected) {
            throw new CategoryNotFoundException(id);
        }
    }
}