import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

type DatabaseStatus = 'connected' | 'disconnected';

interface HealthResponse {
  status: 'ok';
  service: 'signalforge-api';
  database: DatabaseStatus;
}

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  getHealth(): HealthResponse {
    return {
      database: this.getDatabaseStatus(),
      status: 'ok',
      service: 'signalforge-api'
    };
  }

  private getDatabaseStatus(): DatabaseStatus {
    return this.connection.readyState === 1 ? 'connected' : 'disconnected';
  }
}
