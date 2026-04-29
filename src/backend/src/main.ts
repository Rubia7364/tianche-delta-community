import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 全局验证管道
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  // CORS
  app.enableCors();
  
  // Swagger 文档
  const config = new DocumentBuilder()
    .setTitle('天策三角洲社区 API')
    .setDescription('游戏社区平台 API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(3000);
  console.log('🚀 服务器启动成功: http://localhost:3000');
  console.log('📚 API 文档: http://localhost:3000/api/docs');
}
bootstrap();
