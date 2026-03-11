import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Snippet, SnippetDocument, SnippetType } from './snippet.schema';
import {
  CreateSnippetDto,
  UpdateSnippetDto,
  QuerySnippetDto,
} from './dto/snippet.dto';

export interface SnippetPlain {
  _id: unknown;
  title: string;
  content: string;
  tags: string[];
  type: SnippetType;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class SnippetsService {
  constructor(
    @InjectModel(Snippet.name) private snippetModel: Model<SnippetDocument>,
  ) {}

  async create(createSnippetDto: CreateSnippetDto): Promise<SnippetPlain> {
    const snippet = new this.snippetModel(createSnippetDto);
    const saved = await snippet.save();
    return saved.toObject() as SnippetPlain;
  }

  async findAll(
    query: QuerySnippetDto,
  ): Promise<PaginatedResult<SnippetPlain>> {
    const { q, tag, page = 1, limit = 10 } = query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, any> = {};

    if (q && q.trim()) {
      filter.$text = { $search: q.trim() };
    }

    if (tag && tag.trim()) {
      filter.tags = tag.trim().toLowerCase();
    }

    const [data, total] = await Promise.all([
      this.snippetModel
        .find(filter)
        .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean<SnippetPlain[]>()
        .exec(),
      this.snippetModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  async findOne(id: string): Promise<SnippetPlain> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }

    const snippet = await this.snippetModel
      .findById(id)
      .lean<SnippetPlain>()
      .exec();

    if (!snippet) {
      throw new NotFoundException(`Snippet with ID ${id} not found`);
    }

    return snippet;
  }

  async update(
    id: string,
    updateSnippetDto: UpdateSnippetDto,
  ): Promise<SnippetPlain> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }

    const snippet = await this.snippetModel
      .findByIdAndUpdate(id, updateSnippetDto, { new: true, runValidators: true })
      .lean<SnippetPlain>()
      .exec();

    if (!snippet) {
      throw new NotFoundException(`Snippet with ID ${id} not found`);
    }

    return snippet;
  }

  async remove(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }

    const result = await this.snippetModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Snippet with ID ${id} not found`);
    }
  }

  async getAllTags(): Promise<string[]> {
    const tags = await this.snippetModel.distinct('tags').exec();
    return tags.sort();
  }
}
