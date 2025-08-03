export interface BaseRepository<T, CreateInput, UpdateInput, WhereInput = any, IdType = string> {
  create(data: CreateInput): Promise<T>
  findById(id: IdType): Promise<T | null>
  findMany(where?: WhereInput, take?: number, skip?: number): Promise<T[]>
  findFirst(where: WhereInput): Promise<T | null>
  update(id: IdType, data: UpdateInput): Promise<T>
  delete(id: IdType): Promise<T>
  count(where?: WhereInput): Promise<number>
}

export interface PaginationOptions {
  skip?: number
  take?: number
}

export interface PaginationResult<T> {
  items: any
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export class RepositoryError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'RepositoryError'
  }
}
