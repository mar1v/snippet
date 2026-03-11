import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
  MaxLength,
  ArrayMaxSize,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export type SnippetType = 'link' | 'note' | 'command';

export class CreateSnippetDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(1, { message: 'Title cannot be empty' })
  @MaxLength(200, { message: 'Title must be at most 200 characters' })
  @Transform(({ value }) => value?.trim())
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  @MaxLength(10000, { message: 'Content must be at most 10000 characters' })
  content: string;

  @IsOptional()
  @IsArray({ message: 'Tags must be an array' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  @ArrayMaxSize(20, { message: 'Maximum 20 tags allowed' })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((tag: string) => tag.trim().toLowerCase()).filter(Boolean)
      : [],
  )
  tags?: string[];

  @IsEnum(['link', 'note', 'command'], {
    message: 'Type must be one of: link, note, command',
  })
  type: SnippetType;
}

export class UpdateSnippetDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @MaxLength(200, { message: 'Title must be at most 200 characters' })
  @Transform(({ value }) => value?.trim())
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Content cannot be empty' })
  @MaxLength(10000, { message: 'Content must be at most 10000 characters' })
  content?: string;

  @IsOptional()
  @IsArray({ message: 'Tags must be an array' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  @ArrayMaxSize(20, { message: 'Maximum 20 tags allowed' })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((tag: string) => tag.trim().toLowerCase()).filter(Boolean)
      : [],
  )
  tags?: string[];

  @IsOptional()
  @IsEnum(['link', 'note', 'command'], {
    message: 'Type must be one of: link, note, command',
  })
  type?: SnippetType;
}

export class QuerySnippetDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number;
}
