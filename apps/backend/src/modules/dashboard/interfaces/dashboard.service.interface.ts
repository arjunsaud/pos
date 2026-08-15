export interface IDashboardService {
  getTotal<T>(): Promise<T>;
  getAnalytics<T>(): Promise<T>;
}
