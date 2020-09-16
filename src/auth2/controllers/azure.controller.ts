import { Controller, Get, Headers, Logger, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { ProfileDto } from '../dto/response/profile.dto';
import { TokenDto } from '../dto/response/token.dto';
import { AzureService } from '../services/azure.service';

@Controller('azure')
export class AzureController {
  constructor(private readonly authtService: AzureService) {}

  @Get('auth/authorize')
  authorize(@Res() response: Response): void {
    const url = this.authtService.askAuthCode();
    Logger.log(url);
    response.redirect(url);
  }

  // Callback
  @Get('auth/token')
  getCode(
    @Query('code') code: string,
    @Query('state') state: string,
  ): Promise<TokenDto> {
    Logger.log({ code, state });
    return this.authtService.exchangeCodeForToken(code, state);
  }

  @Get('users/me')
  getProfile(
    @Headers('Authorization') bearerToken: string,
  ): Observable<ProfileDto> {
    return this.authtService.getUserProfile(bearerToken);
  }
}
