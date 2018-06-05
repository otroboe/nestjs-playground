/* tslint:disable:no-console */

import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';

@Injectable()
export class LoggerMiddleWare implements NestMiddleware {
  resolve(name: string): MiddlewareFunction {
    return (req, _res, next) => {
      console.log(`[${name}] ${req.protocol} request from ${req.ip} - ${req.method} ${req.originalUrl}`);

      next();
    };
  }
}
