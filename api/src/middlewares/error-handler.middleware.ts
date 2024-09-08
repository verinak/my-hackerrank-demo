import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../helpers/api-response.helper';

export const undefinedRoute = (req: Request, res: Response, next: NextFunction) => {
    return res.status(404).json(ResponseHelper.notFound());
}

export const unsupportedMethod = (req: Request, res: Response, next: NextFunction) => {
    return res.status(405).json(ResponseHelper.methodNotAllowed());    
}

export const jsonError = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json(ResponseHelper.badRequest('Invalid JSON payload.'));
    }
}

export const defaultError = (err: Error, req: Request, res: Response, next: NextFunction) => {
    return res.status(500).json(ResponseHelper.internalServerError());
}