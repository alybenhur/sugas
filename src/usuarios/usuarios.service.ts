
import { Injectable, UseGuards } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/role-guard/role-guard.guard';
import { Roles } from 'src/roles/decorator/role.decorator';
import { ProgramaService } from 'src/programa/programa.service';


@UseGuards(AuthGuard,RolesGuard)
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private userRepository: Repository<Usuario>,
    private readonly programaService: ProgramaService
  ) {}

 @Roles('admin')
 async create(createUserDto: CreateUsuarioDto) {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

 @Roles('admin')
  async findAll() {
    const users = await this.userRepository.find({
      relations: ['programa', 'role'],
      select: ['id', 'name', 'email', 'cedula', 'telefono'],
    });
    return users;
  }

  async findProgramasAsignados(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['programa'],
    });
    return user.programa;
  }
  async findProgramasNoAsignados(id: number) {
    // Obtener el usuario con los programas asignados
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['programa'],
    });
  
    // Obtener todos los programas
    const allProgramas = await this.programaService.findAll();
  
    // Filtrar los programas que no están asignados al usuario
    const programasNoAsignados = allProgramas.filter(
      (programa) => !user.programa.some((userPrograma) => userPrograma.id === programa.id)
    );
  
    return programasNoAsignados;
  }
  

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['programa'],
    });
  }
  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },relations: ['role']
    
    });
  }
  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
