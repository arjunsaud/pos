import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import {
  PaginationQuery,
  PaginationQueryFilterInBoolean,
} from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dto/pagination.list.dto';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import {
  ResponsePaging,
  ResponseSingle,
} from 'src/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';

import { ApiTags } from '@nestjs/swagger';
import { UserProtected } from '../../user/decorators/user.decorator';
import {
  MAILER_LOG_DEFAULT_AVAILABLE_ORDER_BY,
  MAILER_LOG_DEFAULT_AVAILABLE_SEARCH,
  MAILER_LOG_DEFAULT_IS_ACTIVE,
  MAILER_LOG_DEFAULT_ORDER_BY,
  MAILER_LOG_DEFAULT_ORDER_DIRECTION,
  MAILER_LOG_DEFAULT_PER_PAGE,
} from '../constants/mail-log.list.constant';
import {
  MailerDeleteDoc,
  MailerGetDoc,
  MailerListDoc,
} from '../docs/mail-log.doc';
import { MailLogRequestDto } from '../dto/mail.log.request.dto';
import { MailLogDoc, MailLogEntity } from '../entities/mail-log.entities';
import { MailerGetSerialization } from '../serializations/mail-log.get.serialization';
import { MailerListSerialization } from '../serializations/mail-log.list.serialization';
import { MailLogService } from '../services/mail-log.service';

@ApiTags('Mail Log')
@Controller()
export class MailLogController {
  constructor(private readonly emailService: MailLogService) {}

  @MailerListDoc()
  @ResponsePaging('mail.list', {
    serialization: MailerListSerialization,
  })
  @UserProtected()
  @Get('/list')
  async list(
    @PaginationQuery(
      MAILER_LOG_DEFAULT_PER_PAGE,
      MAILER_LOG_DEFAULT_ORDER_BY,
      MAILER_LOG_DEFAULT_ORDER_DIRECTION,
      MAILER_LOG_DEFAULT_AVAILABLE_SEARCH,
      MAILER_LOG_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInBoolean('isActive', MAILER_LOG_DEFAULT_IS_ACTIVE)
    isActive: Record<string, any>,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...isActive,
    };

    const mailDocs: MailLogEntity[] = await this.emailService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this.emailService.getTotal(find);
    const totalPage: number = this.emailService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: mailDocs,
    };
  }

  @MailerGetDoc()
  @ResponseSingle('mail.get', {
    serialization: MailerGetSerialization,
  })
  @UserProtected()
  @RequestParamGuard(MailLogRequestDto)
  @Get('/get/:mail')
  async get(@Param('mail') mail): Promise<IResponse> {
    const mailDocs: MailLogDoc = await this.emailService.findOneById(mail);
    if (!mailDocs) {
      throw new NotFoundException({
        message: 'mail.error.notFound',
      });
    }
    return { data: mailDocs };
  }

  @MailerDeleteDoc()
  @ResponseSingle('mail.delete')
  @UserProtected()
  @RequestParamGuard(MailLogRequestDto)
  @Delete('/delete/:mail')
  async delete(@Param('mail') mail: string): Promise<IResponse> {
    const mailDocs: MailLogDoc = await this.emailService.findOneById(mail);
    if (!mailDocs) {
      throw new NotFoundException({
        message: 'mail.error.notFound',
      });
    }
    await this.emailService.softDelete(mailDocs);
    return { data: mailDocs?._id };
  }

  @MailerDeleteDoc()
  @ResponseSingle('mail.delete')
  @UserProtected()
  @RequestParamGuard(MailLogRequestDto)
  @Delete('/force-delete/:mail')
  async deleteForce(@Param('mail') mail: string): Promise<IResponse> {
    const mailDocs: MailLogDoc = await this.emailService.findOneById(mail);
    if (!mailDocs) {
      throw new NotFoundException({
        message: 'mail.error.notFound',
      });
    }
    await this.emailService.delete(mailDocs);
    return { data: mailDocs?._id };
  }
}
