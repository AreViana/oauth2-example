import { Controller, Get, Headers, Logger, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { Token } from 'simple-oauth2';
import { AzureService } from '../services/azure.service';

@Controller('azure')
export class AzureController {
  constructor(private authtService: AzureService) {}

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
  ): Promise<Token> {
    Logger.log({ code, state });
    return this.authtService.exchangeCodeForToken(code, state);
  }

}
