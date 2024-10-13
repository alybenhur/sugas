import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompetenciaDto } from './dto/create-competencia.dto';
import { UpdateCompetenciaDto } from './dto/update-competencia.dto';
import { Competencia } from './entities/competencia.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class CompetenciaService {
  constructor(
    @InjectRepository(Competencia)
    private competenciaRepository: Repository<Competencia>,
  ) {}

  async create(createCompetenciaDto: CreateCompetenciaDto): Promise<Competencia> {
    return this.competenciaRepository.save(createCompetenciaDto);
  }
 
  findAll(): Promise<Competencia[]> {
    return this.competenciaRepository.find({ relations: ['programas'] });
  }
  async findByIds(competenciasId: number[]): Promise<Competencia[]> {
    // Buscar las competencias por sus IDs
    return await this.competenciaRepository.find({
      where: {
        id: In(competenciasId)
      },
    
    });
  }

  findOne(codigo : string): Promise<Competencia> {
    return this.competenciaRepository.findOne({ where: { codigo }, relations: ['programas'] });
  }

  async update(id: number, updateCompetenciaDto: UpdateCompetenciaDto): Promise<Competencia> {
    const compe = await this.competenciaRepository.findOne({where : {id}});

    if (!compe) {
      throw new NotFoundException(`Competencia con ID ${id} no encontrado`);
    }
    Object.assign(compe, updateCompetenciaDto);

    // Guardar los cambios en la base de datos
    return this.competenciaRepository.save(compe);
  }


  async remove(codigo: string): Promise<void> {
    // Buscar el usuario por su código (ID)
    const competencia = await this.competenciaRepository.findOne({ where: { codigo: codigo } });

    // Lanzar excepción si no se encuentra el usuario
    if (!competencia) {
      throw new NotFoundException(`Programa con código ${codigo} no encontrado`);
    }

    // Eliminar el usuario
    await this.competenciaRepository.remove(competencia);
  }
}
