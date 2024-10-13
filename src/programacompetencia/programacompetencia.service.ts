import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProgramacompetenciaDto } from './dto/create-programacompetencia.dto';
import { UpdateProgramacompetenciaDto } from './dto/update-programacompetencia.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Programa } from 'src/programa/entities/programa.entity';
import { Competencia } from 'src/competencia/entities/competencia.entity';
import { ProgramaService } from 'src/programa/programa.service';
import { CompetenciaService } from 'src/competencia/competencia.service';

@Injectable()
export class ProgramacompetenciaService {
  constructor(
    @InjectRepository(Programa)
    private programaRepository: Repository<Programa>,
    @InjectRepository(Competencia)
    private competenciaRepository: Repository<Competencia>,
    private programaService: ProgramaService,
    private competenciaService: CompetenciaService
  ) {}
  async create(createProgramaCompetenciaDto: CreateProgramacompetenciaDto) {
    // Buscar el programa por ID
    const programa = await this.programaService.findOneById(createProgramaCompetenciaDto.programaId);
  
    if (!programa) {
      throw new NotFoundException(`Programa con ID ${createProgramaCompetenciaDto.programaId} no encontrado`);
    }
  
    // Obtener las competencias solicitadas
    const competencias = await this.competenciaService.findByIds(createProgramaCompetenciaDto.competenciaId);
  
    if (!competencias || competencias.length === 0) {
      throw new NotFoundException(`Competencias con ID ${createProgramaCompetenciaDto.competenciaId} no encontradas`);
    }
  
    // Verificar las competencias existentes en el programa
    const competenciasExistentesSet = new Set(programa.competencias.map(c => c.id));
  
    // Filtrar las competencias que ya están asociadas para no agregarlas de nuevo
    const nuevasCompetencias = competencias.filter(
      nuevaCompetencia => !competenciasExistentesSet.has(nuevaCompetencia.id)
    );
  
    // Si no hay nuevas competencias, podemos retornar una respuesta adecuada
    if (nuevasCompetencias.length === 0) {
      return {
        message: 'Todas las competencias ya estaban asociadas al programa.',
        programa,
      };
    }
  
    // Combinar las competencias existentes con las nuevas
    programa.competencias = [...programa.competencias, ...nuevasCompetencias];
  
    // Cargar el programa con las competencias combinadas
    const programaCompetencia = await this.programaRepository.preload({
      id: programa.id,
      competencias: programa.competencias,
    });
  
    if (!programaCompetencia) {
      throw new NotFoundException(`No se pudo encontrar el programa con ID ${programa.id} para actualizar.`);
    }
  
    // Guardar el programa con las nuevas competencias
    const programaActualizado = await this.programaRepository.save(programaCompetencia);
  
    return {
      message: 'Proceso completado.',
      competenciasAgregadas: nuevasCompetencias,
      competenciasYaExistentes: competencias.filter(c => competenciasExistentesSet.has(c.id)),
      programa: programaActualizado,
    };
    
  }

  findAll() {
    return `This action returns all programacompetencia`;
  }

  findOne(programaId: number) {
   
    return 'ok';
  }
  

  update(id: number, updateProgramacompetenciaDto: UpdateProgramacompetenciaDto) {
    return `This action updates a #${id} programacompetencia`;
  }

  async remove(programId: number, competenciaId : number) {
    console.log(programId, competenciaId)
    const programa = await this.programaRepository.findOne({
      where: { id: programId },
      relations: ['competencias'],
    });

    console.log(programa)
    if (!programa) {
      throw new Error('Programa not found');
    }

    // Filtrar el rol que quieres eliminar
    programa.competencias = programa.competencias.filter(competencia => competencia.id != competenciaId);
    console.log(programa)

    return await this.programaRepository.save(programa);
  }

  
}
