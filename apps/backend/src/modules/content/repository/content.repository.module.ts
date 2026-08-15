import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { ContentEntity, ContentSchema } from './entities/content.entity';
import { ContentRepository } from './repositories/content.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: ContentEntity.name,
          schema: ContentSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [ContentRepository],
  exports: [ContentRepository],
})
export class ContentRepositoryModule {}
