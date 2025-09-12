import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString } from 'class-validator';

export class PaginationDto {
    @ApiProperty()
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    page?: number = 1;

    @ApiProperty()
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    limit?: number = 10;

    @ApiProperty()
    @IsOptional()
    @IsString()
    search?: string;
}
