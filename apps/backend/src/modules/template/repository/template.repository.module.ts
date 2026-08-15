import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { TemplateEntity, TemplateSchema } from './entities/template.entity';
import { TemplateRepository } from './repositories/template.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: TemplateEntity.name,
          schema: TemplateSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [TemplateRepository],
  exports: [TemplateRepository],
})
export class TemplateRepositoryModule {}
