import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationPostDto } from './dto/pagination-post.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
    constructor(private prisma: PrismaService) {}

    async create(createPostDto: CreatePostDto) {
        const post = await this.prisma.post.findUnique({
            where: { slug: createPostDto.slug },
        });
        if (post) {
            throw new ConflictException('Post with this slug already exists');
        }

        return this.prisma.post.create({
            data: createPostDto,
        });
    }

    async findAll(paginationPostDto: PaginationPostDto) {
        const { page, limit } = paginationPostDto;

        const whereCondition = this.buildWhereCondition(paginationPostDto);

        const totalRecords = await this.prisma.post.count({
            where: whereCondition,
        });

        const lastPage = Math.ceil(totalRecords / limit);

        const data = await this.prisma.post.findMany({
            skip: (page - 1) * limit,
            take: limit,
            where: whereCondition,
            include: {
                categories: true,
                author: true,
                comments: true,
            },
        });

        return {
            data,
            meta: {
                total: totalRecords,
                page: page,
                lastPage: lastPage,
            },
        };
    }

    private buildWhereCondition(paginationPostDto: PaginationPostDto) {
        const { search, title, slug, content, author, categories } =
            paginationPostDto;

        const whereCondition: Prisma.PostWhereInput = {};

        if (search) {
            whereCondition.OR = [
                { title: { contains: search } },
                { content: { contains: search } },
            ];
        } else {
            if (title) {
                whereCondition.title = { contains: title };
            }
            if (content) {
                whereCondition.content = { contains: content };
            }
        }

        if (slug) {
            whereCondition.slug = { contains: slug };
        }
        if (author) {
            whereCondition.author = { name: { contains: author } };
        }
        if (categories && categories.length > 0) {
            whereCondition.categories = {
                some: {
                    slug: {
                        in: categories,
                    },
                },
            };
        }

        return whereCondition;
    }

    async findOne(id: string, field: string = 'id') {
        const whereClause = { [field]: field === 'id' ? Number(id) : id };
        const post = await this.prisma.post.findFirst({
            where: whereClause,
            include: {
                categories: true,
                author: true,
                comments: true,
            },
        });

        if (!post) {
            throw new NotFoundException(`Product with id #${id} not found`);
        }
        return post;
    }

    async update(id: number, updatePostDto: UpdatePostDto) {
        await this.findOne(id.toString());
        return this.prisma.post.update({
            where: { id },
            data: updatePostDto,
        });
    }

    async remove(id: number) {
        await this.findOne(id.toString());
        return this.prisma.post.delete({
            where: { id },
        });
    }
}
