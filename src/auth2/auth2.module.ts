import { HttpModule, Module } from '@nestjs/common';
import { AzureController } from './controllers/azure.controller';
import { AzureService } from './services/azure.service';

@Module({
  imports: [HttpModule],
  providers: [AzureService],
  controllers: [AzureController],
})
export class Auth2Module {}
