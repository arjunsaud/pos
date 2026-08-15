import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { OtpType, isOtpType } from '@posnepal/shared';

import { HelperHashService } from 'src/common/helper/services/helper.hash.service';
import { HelperNumberService } from 'src/common/helper/services/helper.number.service';
import { VerificationRepository } from './repository/verification.repository';

const OTP_TTL_MS = 5 * 60 * 1000;

@Injectable()
export class VerificationService {
  constructor(
    private readonly repository: VerificationRepository,
    private readonly helperService: HelperNumberService,
    private readonly helperHashService: HelperHashService,
  ) {}

  async createOTP({
    type,
    mobileNumber,
    email,
  }: {
    type: OtpType;
    mobileNumber?: string;
    email?: string;
  }) {
    if (!isOtpType(type)) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'otp.type.invalid',
      });
    }

    if (!email && !mobileNumber) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'otp.destination.required',
      });
    }

    const existing = await this.checkOTP({ type, email, mobileNumber });
    if (existing) {
      await this.repository.delete(existing);
    }

    const plainOtp = String(this.helperService.random(6)).padStart(6, '0');
    const hashed = this.hashOtp({ type, email, mobileNumber, otp: plainOtp });
    const expireAt = new Date(Date.now() + OTP_TTL_MS);

    await this.repository.create({
      type,
      otp: hashed,
      mobileNumber,
      email: email?.toLowerCase(),
      expireAt,
    });

    // Return plaintext only to the caller that sends SMS/email — never persist it.
    return { type, email, mobileNumber, otp: plainOtp, expireAt };
  }

  async verifyMobileOTP({
    type,
    mobileNumber,
    otp,
  }: {
    type: OtpType;
    mobileNumber: string;
    otp: string;
  }) {
    return this.verifyOtp({ type, mobileNumber, otp });
  }

  async verifyEmailOTP({
    type,
    email,
    otp,
  }: {
    type: OtpType;
    email: string;
    otp: string;
  }) {
    return this.verifyOtp({ type, email, otp });
  }

  async checkOTP({
    type,
    email,
    mobileNumber,
  }: {
    type: OtpType;
    email?: string;
    mobileNumber?: string;
  }) {
    const filter: Record<string, unknown> = { type };
    if (email) filter.email = email.toLowerCase();
    else if (mobileNumber) filter.mobileNumber = mobileNumber;
    else return null;

    return this.repository.findOne(filter);
  }

  private async verifyOtp({
    type,
    email,
    mobileNumber,
    otp,
  }: {
    type: OtpType;
    email?: string;
    mobileNumber?: string;
    otp: string;
  }) {
    if (!isOtpType(type)) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'otp.type.invalid',
      });
    }

    const record = await this.checkOTP({ type, email, mobileNumber });
    if (!record) {
      throw new BadRequestException({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'otp.invalid',
      });
    }

    if (record.expireAt && new Date(record.expireAt).getTime() <= Date.now()) {
      await this.repository.delete(record);
      throw new BadRequestException({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'otp.expired',
      });
    }

    const hashed = this.hashOtp({ type, email, mobileNumber, otp });
    if (!this.helperHashService.sha256Compare(hashed, record.otp)) {
      throw new BadRequestException({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'otp.invalid',
      });
    }

    await this.repository.delete(record);
    return { message: 'verified' };
  }

  private hashOtp({
    type,
    email,
    mobileNumber,
    otp,
  }: {
    type: OtpType;
    email?: string;
    mobileNumber?: string;
    otp: string;
  }): string {
    const dest = (email ?? mobileNumber ?? '').toLowerCase();
    return this.helperHashService.sha256(`${type}:${dest}:${otp}`);
  }
}
