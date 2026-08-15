import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const writeIntoFile = configService.get<boolean>('debugger.writeIntoFile');
        const maxFiles = configService.get<string>('debugger.maxFiles');
        const maxSize = configService.get<string>('debugger.maxSize');

        const transports: winston.transport[] = [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              winston.format.colorize(),
              winston.format.printf(({ timestamp, level, message, context, ms }) => {
                return `${timestamp} [${level}] ${context ? `[${context}] ` : ''}${message} ${ms}`;
              }),
            ),
          }),
        ];

        if (writeIntoFile) {
          transports.push(
            new winston.transports.DailyRotateFile({
              filename: 'logs/error-%DATE%.log',
              datePattern: 'YYYY-MM-DD',
              zippedArchive: true,
              maxSize: maxSize,
              maxFiles: maxFiles,
              level: 'error',
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
              ),
            }),
            new winston.transports.DailyRotateFile({
              filename: 'logs/combined-%DATE%.log',
              datePattern: 'YYYY-MM-DD',
              zippedArchive: true,
              maxSize: maxSize,
              maxFiles: maxFiles,
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
              ),
            }),
          );
        }

        return {
          transports,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DebuggerModule {}
