import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParamsValidationPipe implements PipeTransform<any> {
  async transform(value: string) {
    if (!value || !value.trim()) {
      throw new BadRequestException('Invalid params');
    }
    return value;
  }
}