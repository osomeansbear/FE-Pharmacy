export interface APIResponse<T> {
  message: string;
  data: T;
}

export interface APIErrorResponse {
  error: string;
}
