import { Module } from '@nestjs/common';
import { AzureController } from './controllers/azure.controller';
import { AzureService } from './services/azure.service';

@Module({
  providers: [AzureService],
  controllers: [AzureController],
})
export class Auth2Module {}
