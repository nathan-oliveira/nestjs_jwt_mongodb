import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
