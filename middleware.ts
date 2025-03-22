import type { NextFunction, Request, Response } from "express";
import {
  activeRequestsGauge,
  httpRequestDurationMicroseconds,
  requestCounter,
} from ".";

// export const middleware = (req: Request, res: Response, next: NextFunction) => {
//     const startTime = Date.now();
//     next();
//     const endTime = Date.now();
//     console.log(`Request took ${endTime - startTime}ms`);
// }
export const requestCountMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  activeRequestsGauge.inc();

  res.on("finish", () => {
    // console.log(req.path,req.route,'route')
    if (req.path !== "/metrics") {
      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log(`Request took ${endTime - startTime}ms`);

      requestCounter.inc({
        method: req.method,
        route: req.route ? req.route.path : req.path,
        status_code: res.statusCode,
      });
      httpRequestDurationMicroseconds.observe(
        {
          method: req.method,
          route: req.route ? req.route.path : req.path,
          code: res.statusCode,
        },
        duration
      );
      activeRequestsGauge.dec();
    }
  });

  next();
};
