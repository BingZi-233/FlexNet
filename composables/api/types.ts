/**
 * API响应类型
 */
export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

/**
 * 请求选项类型
 */
export interface RequestOptions {
  method?: string;
  params?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
  cache?: string;
  [key: string]: any;
}

/**
 * HTTP请求方法类型
 */
export interface HttpMethods {
  get: <T>(url: string, params?: Record<string, any>, options?: RequestOptions) => Promise<ApiResponse<T>>;
  post: <T>(url: string, body?: any, options?: RequestOptions) => Promise<ApiResponse<T>>;
  put: <T>(url: string, body?: any, options?: RequestOptions) => Promise<ApiResponse<T>>;
  delete: <T>(url: string, body?: any, options?: RequestOptions) => Promise<ApiResponse<T>>;
}

/**
 * 菜单API类型
 */
export interface MenuApi {
  getAdminMenu: () => Promise<ApiResponse<any>>;
  getDashboardMenu: () => Promise<ApiResponse<any>>;
  getDeveloperMenu: () => Promise<ApiResponse<any>>;
}

/**
 * API服务类型
 */
export interface ApiService {
  request: <T>(url: string, options?: RequestOptions) => Promise<ApiResponse<T>>;
  http: HttpMethods;
  menu: MenuApi;
} 