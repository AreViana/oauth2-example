import {
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthorizationCode, Token } from 'simple-oauth2';

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

}
