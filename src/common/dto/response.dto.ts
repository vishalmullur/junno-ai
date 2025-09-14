export class ApiResponse<T> {
  success: boolean;
  data: T;
}
export class ErrorResponse {
  success: boolean;
  error: string;
}
