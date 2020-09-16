import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Auth2Module } from './auth2/auth2.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), Auth2Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
