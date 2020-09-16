export class TokenDto {
  readonly token_type: string;
  readonly scope: string;
  readonly access_token: string;
  readonly expires_at: string;
  readonly expires_in: number;
  readonly ext_expires_in: number;
}
