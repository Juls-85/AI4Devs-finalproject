import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@infrastructure/persistence/database.module';
import { SecurityModule } from '@shared/security/security.module';
import { AuthModule } from './auth/auth.module';
import { MembersModule } from './members/members.module';
import { RoutesModule } from './routes/routes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    SecurityModule,
    DatabaseModule,
    AuthModule,
    MembersModule,
    RoutesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
