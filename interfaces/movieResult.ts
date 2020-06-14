export interface MovieResult {
  results: Array<any>,
  page: number,
  total_results: number,
  total_pages: number,
  dates?: object
}

export interface Genre {
  id: number,
  name: string
}