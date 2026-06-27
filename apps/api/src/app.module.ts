import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, type MongooseModuleOptions } from '@nestjs/mongoose';

import { validateEnvironment } from './config/env.validation';
import { DashboardModule } from './dashboard/dashboard.module';
import { DemoModule } from './demo/demo.module';
import { ExtractionRunsModule } from './extraction-runs/extraction-runs.module';
import { HealthModule } from './health/health.module';
import { InsightsModule } from './insights/insights.module';
import { NotesModule } from './notes/notes.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): MongooseModuleOptions => ({
        uri: configService.getOrThrow<string>('MONGODB_URI'),
        retryAttempts: 3,
        retryDelay: 1000,
        serverSelectionTimeoutMS: 5000
      })
    }),
    HealthModule,
    ProjectsModule,
    NotesModule,
    InsightsModule,
    DashboardModule,
    DemoModule,
    ExtractionRunsModule
  ]
})
export class AppModule {}
