import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { PaginationPostDto } from './dto/pagination-post.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new post' })
    @ApiOkResponse({ description: 'Post created successfully' })
    create(@Body() createPostDto: CreatePostDto) {
        return this.postsService.create(createPostDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get a list of all posts with pagination' })
    @ApiOkResponse({ description: 'List of posts.' })
    findAll(@Query() paginationPostDto: PaginationPostDto) {
        return this.postsService.findAll(paginationPostDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Find a post by ID or slug' })
    @ApiParam({
        name: 'id',
        description: 'The ID or slug of the post',
        type: String,
    })
    @ApiQuery({
        name: 'field',
        description: 'The field to search by (e.g., "slug" or "id")',
        required: false,
        enum: ['id', 'slug'],
    })
    @ApiOkResponse({ description: 'Post found.' })
    @ApiNotFoundResponse({ description: 'Post not found.' })
    findOne(@Param('id') id: string, @Query('field') field?: string) {
        return this.postsService.findOne(id, field);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an existing post' })
    @ApiOkResponse({ description: 'Post updated successfully.' })
    @ApiNotFoundResponse({ description: 'Post not found.' })
    update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postsService.update(+id, updatePostDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a post' })
    @ApiOkResponse({ description: 'Post deleted successfully.' })
    @ApiNotFoundResponse({ description: 'Post not found.' })
    remove(@Param('id') id: string) {
        return this.postsService.remove(+id);
    }
}
