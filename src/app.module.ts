import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CallsModule } from './calls/calls.module';
import { ExternalApisModule } from './external-apis/external-apis.module';
import { UserModule } from './user/user.module';
import { ApiKeyModule } from './api-key/api-key.module';
import { WidgetKeyModule } from './widget-key/widget-key.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    CallsModule,
    ExternalApisModule,
    UserModule,
    ApiKeyModule,
    WidgetKeyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
