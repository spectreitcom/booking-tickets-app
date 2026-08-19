import './instrumentation';

import { NestFactory } from '@nestjs/core';
import { GatewayServiceModule } from './gateway-service.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceExceptionFilter } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(GatewayServiceModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new MicroserviceExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Gateway Service')
    .setDescription('Booking tickets app gateway API')
    .setVersion('1.0')
    .setContact(
      'Przemysław Chudziński',
      'mywebsite.com',
      'p.chudzinski.spectreit@gmail.com',
    )
    .setVersion('1.0.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    jsonDocumentUrl: '/api/docs-json',
    customJsStr: "document.querySelector('html').classList.add('dark-mode')",
  });

  await app.listen(process.env.port ?? 3000);
}

bootstrap().catch((e) => console.error(e));
