import {
  BadRequestException,
  HttpException,
  HttpService,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthorizationCode } from 'simple-oauth2';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProfileDto } from '../dto/response/profile.dto';
import { TokenDto } from '../dto/response/token.dto';
import { AuthorizeDto } from '../dto/response/authorize.dto';

@Injectable()
export class AzureService {
  private client: AuthorizationCode;
  private redirectUrl: string;
  private scope: string;
  private readonly state = 'MyOwnState';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const clientId = this.configService.get<string>('AZURE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('AZURE_CLIENT_SECRET');
    const tenantId = this.configService.get<string>('AZURE_TENANT_ID');

    this.scope = this.configService.get<string>('AZURE_SCOPE');
    this.redirectUrl = this.configService.get<string>('AZURE_REDIRECT_URL');

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

  // 1) Get authorize host url
  askAuthCode(): AuthorizeDto {
    const url = this.client.authorizeURL({
      redirect_uri: this.redirectUrl,
      scope: this.scope,
      state: this.state,
    });
    Logger.log(url);

    return { url };
  }

  // 2) Exchange code for access token
  async exchangeCodeForToken(code: string, state: string): Promise<TokenDto> {
    this.validateState(state);

    const options = {
      code,
      redirect_uri: this.redirectUrl,
    };

    try {
      const accessToken = await this.client.getToken(options);

      return accessToken.token as TokenDto;
    } catch (error) {
      Logger.error(error.message);
    }
  }

  // 3) Try access token
  getUserProfile(token: string): Observable<ProfileDto> {
    return this.httpService
      .get('https://graph.microsoft.com/v1.0/me', {
        headers: { Authorization: token },
      })
      .pipe(
        map(response => response.data),
        catchError(error => {
          const errorData = error.response.data;
          Logger.error(errorData);
          throw new HttpException(
            errorData.error.message,
            error.response.status,
          );
        }),
      );
  }

  private validateState(state: string) {
    if (state === this.state) {
      return true;
    }

    throw new BadRequestException('status changed');
  }
}
