export type EntityId = string;

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export type SearchParams = PaginationParams & {
  query?: string;
};

export type ActionResult<T = void> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: string;
    };
