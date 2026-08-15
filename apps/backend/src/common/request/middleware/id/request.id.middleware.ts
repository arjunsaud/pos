import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { DatabaseDefaultUUID } from 'src/common/database/constants/database.function.constant';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  async use(
    req: IRequestApp,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const uuid: string = DatabaseDefaultUUID();
    req.__id = uuid;
    next();
  }
}
