import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configura para que la informacion sea enviada de acuerdo a las especificaciones del back
  app.useGlobalPipes( new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, }) );

  await app.listen(3000);
}
bootstrap();
