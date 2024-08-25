export interface IApiResponse<T = null> {
    status: number;
    data?: T | null;
    error?: Error | null;
    message: string;
    success: boolean;
}