import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common';

export class PaginationPostDto extends PaginationDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    slug?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    content?: string;

    @ApiProperty({
        type: String,
        description: 'Filters posts by author name',
    })
    @IsOptional()
    @IsString()
    author?: string;

    @ApiProperty({
        type: [String],
        description:
            'Filters posts by category slugs, separated by commas (e.g., "angular,nest")',
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.split(',');
        }
        return value;
    })
    categories?: string[];
}
