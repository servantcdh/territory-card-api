import { Module } from '@nestjs/common';
import { AssignController } from './assign.controller';
import { AssignService } from './assign.service';

@Module({
  controllers: [AssignController],
  providers: [AssignService]
})
export class AssignModule {}
