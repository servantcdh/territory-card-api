import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { CardContent } from './entities/card-content.entity';
import { CardTag } from './entities/card-tag.entity';
import { Card } from './entities/card.entity';
import { CardContentRepository } from './repositories/card-content.repository';
import { CardTagRepository } from './repositories/card-tag.repository';
import { CardRepository } from './repositories/card.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Card, CardContent, CardTag])],
  controllers: [CardController],
  providers: [
    CardService,
    JwtStrategy,
    CardRepository,
    CardContentRepository,
    CardTagRepository,
  ],
})
export class CardModule {}
