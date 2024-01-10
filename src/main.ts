import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Configura para que la informacion sea enviada de acuerdo a las especificaciones del back
  app.useGlobalPipes( new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, }) );

  // Si la app tiene una variable de entorno con el puerto, lo ejecuta ahi de lo contrario usa el 3000
  await app.listen( process.env.PORT ?? 3000);
}
bootstrap();
