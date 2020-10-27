export type Pagination = {
  total: number,
  next?: string,
  prev?: string,
  last: string,
  first: string,
  pageSize: number,
  currentPage: number,
  searchText: string,
};