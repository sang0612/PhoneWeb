import { count, Observable, skip, take, toArray } from "rxjs";

export class PaginatedResult<T> {
    pageIndex: number;
    totalPages: number;
    items: T[] ;
  
    constructor(items: T[], count: number, pageIndex: number, pageSize: number) {
      this.pageIndex = pageIndex;
      this.totalPages = Math.ceil(count / pageSize);
      this.items = items;
    }
  
    get hasPreviousPage(): boolean {
      return this.pageIndex > 1;
    }
  
    get hasNextPage(): boolean {
      return this.pageIndex < this.totalPages;
    }
  
    static async create<T>(
        query: Observable<T[]>,
        pageIndex: number,
        pageSize: number
      ): Promise<PaginatedResult<T>> {
        const [items, totalCount] = await Promise.all([
          query.pipe(
            skip((pageIndex - 1) * pageSize),
            take(pageSize),
            toArray()
          ).toPromise(),
          query.pipe(
            count()
          ).toPromise()
        ]) as [T[], number];
      
        return new PaginatedResult<T>(items, totalCount, pageIndex, pageSize);
      }

      
  }