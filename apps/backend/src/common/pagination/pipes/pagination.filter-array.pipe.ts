import { Inject, Injectable, mixin, Type } from '@nestjs/common';
import { PipeTransform, Scope } from '@nestjs/common/interfaces';
import { REQUEST } from '@nestjs/core';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';

export function PaginationFilterArrayPipe<T>(): Type<PipeTransform> {
  @Injectable({ scope: Scope.REQUEST })
  class MixinPaginationFilterInEnumPipe implements PipeTransform {
    constructor(@Inject(REQUEST) protected readonly request: IRequestApp) {}

    async transform(value: string): Promise<T[]> {
      let finalValue: T[] = [];

      if (value) {
        finalValue = value.split(',') as T[];
      }
      return finalValue;
    }
  }

  return mixin(MixinPaginationFilterInEnumPipe);
}
