import { Injectable } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import {
  IErrors,
  IErrorsImport,
  IValidationErrorImport,
} from 'src/common/error/interfaces/error.interface';
import { getResponseMessage } from 'src/common/message/constants/messages.constant';
import {
  IMessageErrorOptions,
  IMessageOptions,
  IMessageSetOptions,
} from 'src/common/message/interfaces/message.interface';
import { IMessageService } from 'src/common/message/interfaces/message.service.interface';

@Injectable()
export class MessageService implements IMessageService {
  getAvailableLanguages(): string[] {
    return ['en'];
  }

  getLanguage(): string {
    return 'en';
  }

  filterLanguage(customLanguages: string[]): string[] {
    return customLanguages?.includes('en') ? ['en'] : ['en'];
  }

  setMessage(_lang: string, key: string, options?: IMessageSetOptions): string {
    return getResponseMessage(key, options?.properties);
  }

  getRequestErrorsMessage(
    requestErrors: ValidationError[],
    options?: IMessageErrorOptions,
  ): IErrors[] {
    const messages: Array<IErrors[]> = [];
    for (const requestError of requestErrors) {
      let children: Record<string, any>[] = requestError.children;
      let constraints: string[] = Object.keys(requestError.constraints ?? []);
      let property: string = requestError.property;
      let propertyValue: string = requestError.value;

      while (children?.length > 0) {
        property = `${property}.${children[0].property}`;

        if (children[0].children?.length > 0) {
          children = children[0].children;
        } else {
          constraints = Object.keys(children[0].constraints);
          propertyValue = children[0].value;
          children = [];
        }
      }

      const errors: IErrors[] = [];
      for (const constraint of constraints) {
        errors.push({
          property,
          message: this.get(`request.${constraint}`, {
            customLanguages: options?.customLanguages,
            properties: {
              property,
              value: propertyValue,
            },
          }),
        });
      }

      messages.push(errors);
    }

    return messages.flat(1) as IErrors[];
  }

  getImportErrorsMessage(
    errors: IValidationErrorImport[],
    options?: IMessageErrorOptions,
  ): IErrorsImport[] {
    return errors.map((val) => ({
      row: val.row,
      file: val.file,
      sheet: val.sheet,
      errors: this.getRequestErrorsMessage(val.errors, options),
    }));
  }

  get<T = string>(key: string, options?: IMessageOptions): T {
    return this.setMessage('en', key, {
      properties: options?.properties,
    }) as T;
  }
}
