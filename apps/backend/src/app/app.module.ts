import { BullModule, InjectQueue } from '@nestjs/bull';
import { Module, OnModuleInit, Optional } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import { CommonModule } from 'src/common/common.module';
import { isRedisEnabled } from 'src/common/helper/constants/redis.constant';
import { MailModule } from 'src/modules/mail/mail.module';
import { RouterModule } from '../router/router.module';

const redisEnabled = isRedisEnabled();

@Module({
  imports: [
    CommonModule,
    RouterModule.forRoot(),
    ...(redisEnabled
      ? [
          MailModule,
          BullModule.registerQueue({
            name: 'default',
          }),
          BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
              const tls = configService.get('redis.tls');
              return {
                redis: {
                  host: configService.get<string>('redis.host'),
                  port: configService.get<number>('redis.port'),
                  password: configService.get<string>('redis.pass'),
                  ...(tls ? { tls } : {}),
                  connectTimeout: 10000,
                  maxRetriesPerRequest: 3,
                },
              };
            },
            inject: [ConfigService],
          }),
        ]
      : []),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(
    @Optional() @InjectQueue('default') private readonly queue?: Queue,
  ) {}

  async onModuleInit() {
    if (!redisEnabled) {
      console.log('ℹ️  Redis queues disabled (REDIS_ENABLE=false)');
      return;
    }

    const client = this.queue?.client;
    if (client?.status === 'ready') {
      console.log('✅ Redis connected');
    } else {
      console.error('❌ Redis not connected');
    }
  }
}
