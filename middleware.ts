import type { NextFunction, Request, Response } from "express";
import { requestCounter } from ".";

// export const middleware = (req: Request, res: Response, next: NextFunction) => {
//     const startTime = Date.now();
//     next();
//     const endTime = Date.now();
//     console.log(`Request took ${endTime - startTime}ms`);
// }
export const requestCountMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    res.on('finish', () => {
        const endTime = Date.now();
        console.log(`Request took ${endTime - startTime}ms`);

        requestCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        });
    });

    next();
};