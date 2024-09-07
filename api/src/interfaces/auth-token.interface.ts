export interface IUserToken {
    id: string;
    role: string;
    iat?: number;
    exp?: number;
}