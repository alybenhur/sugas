import { Programa } from "src/programa/entities/programa.entity";
import { Role } from "src/roles/entities/role.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 80 })
    name: string;

    @Column({ length: 80 })
    email: string;

    @Column({ length: 11 })
    cedula: string;

    @Column({ length: 11 })
    telefono: string;
    
    @Column()
    password: string;

     @ManyToMany(()=>Programa, (programa) => programa.usuario)
     programa: Programa[]

    @ManyToOne(() => Role, (role) => role.usuario)
    role: Role

}
