import { Controller, Get, Headers, Logger, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthorizeDto } from '../dto/response/authorize.dto';
import { ProfileDto } from '../dto/response/profile.dto';
import { TokenDto } from '../dto/response/token.dto';
import { AzureService } from '../services/azure.service';

@Controller('azure')
export class AzureController {
  constructor(private readonly authtService: AzureService) {}

  @Get('auth/authorize')
  authorize(): AuthorizeDto {
    return this.authtService.askAuthCode();
  }

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
