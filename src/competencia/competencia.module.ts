import { Module } from '@nestjs/common';
import { CompetenciaService } from './competencia.service';
import { CompetenciaController } from './competencia.controller';
import { Competencia } from './entities/competencia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Competencia])],
  controllers: [CompetenciaController],
  providers: [CompetenciaService],
  exports:[CompetenciaService]
})
export class CompetenciaModule {}
