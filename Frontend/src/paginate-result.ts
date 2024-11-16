export interface PaginateResult<T>{
    items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}