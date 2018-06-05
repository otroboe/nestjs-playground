import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { ApplicationModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);

  const options = new DocumentBuilder()
    .setTitle('API Movie schedule')
    .setDescription('API generating fake film shows in different movie theaters')
    .setVersion('0.0.1')
    .addTag('locations')
    .addTag('movies')
    .build();

  // Swagger
  SwaggerModule.setup('/swagger', app, SwaggerModule.createDocument(app, options));

  // Assets
  app.useStaticAssets(path.join(__dirname, 'public'));

  // Open full CORS
  app.enableCors();

  await app.listen(3000);
}

bootstrap();
