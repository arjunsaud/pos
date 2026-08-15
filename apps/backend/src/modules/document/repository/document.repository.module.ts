import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { DocumentEntity, DocumentSchema } from './entities/document.entity';
import { DocumentRepository } from './repositories/document.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: DocumentEntity.name,
          schema: DocumentSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [DocumentRepository],
  exports: [DocumentRepository],
})
export class DocumentRepositoryModule {}
