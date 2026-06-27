import { Controller, Post } from '@nestjs/common';

import { DemoResetResponse, DemoSeedResponse } from './demo.response';
import { DemoService } from './demo.service';

@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Post('seed')
  seed(): Promise<DemoSeedResponse> {
    return this.demoService.seed();
  }

  @Post('reset')
  reset(): Promise<DemoResetResponse> {
    return this.demoService.reset();
  }
}
