export interface ApiResponse {
  error?: string;
  success: boolean;
}

export interface SearchResponse<T> extends ApiResponse {
  items: T[];
}
