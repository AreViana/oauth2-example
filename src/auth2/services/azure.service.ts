import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthorizationCode, Token } from 'simple-oauth2';
import * as fetch from 'node-fetch';

@Injectable()
export class AzureService {
  private client: AuthorizationCode;
  private redirectUrl: string;
  private readonly state = 'MyOwnState';

  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('API_HOST');
    const clientId = this.configService.get<string>('AZURE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('AZURE_CLIENT_SECRET');
    const tenantId = this.configService.get<string>('AZURE_TENANT_ID');

    this.redirectUrl = `${host}/azure/auth/token`;

    this.client = new AuthorizationCode({
      client: {
        id: clientId,
        secret: clientSecret,
      },
      auth: {
        tokenHost: 'https://login.microsoftonline.com',
        tokenPath: `/${tenantId}/oauth2/v2.0/token`,
        authorizePath: `/${tenantId}/oauth2/v2.0/authorize`,
      },
      options: {
        authorizationMethod: 'body',
      },
    });
  }

  // 1) Redirect to authorize view
  askAuthCode(): string {
    return this.client.authorizeURL({
      redirect_uri: this.redirectUrl,
      scope: process.env.AZURE_SCOPE,
      state: this.state,
    });
  }

  // 2) Exchange code for access token
  async exchangeCodeForToken(code: string, state: string): Promise<Token> {
    this.validateState(state);

    const options = {
      code,
      redirect_uri: this.redirectUrl,
    };

    try {
      const accessToken = await this.client.getToken(options);
      return accessToken.token;
    } catch (error) {
      Logger.error(error.message);
    }
  }

  // 3) Try access token
  async getUserProfile(token: string): Promise<unknown> {
    const response = await fetch(`https://graph.microsoft.com/v1.0/me`, {
      headers: { Authorization: token },
    });

    const json = response.json();
    if (!response.status.ok) {
      throw new HttpException(await json, response.status);
    }
    return json;
  }

  private validateState(state: string) {
    if (state === this.state) {
      return true;
    }

    throw new BadRequestException('status changed');
  }
}
