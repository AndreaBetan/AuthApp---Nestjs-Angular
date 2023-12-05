import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    // console.log(createUserDto)
    
    // 1. Encriptar la contraseña
    try {
      // Desestructuro el password y todo lo demas queda almacenado en userData
      const {password, ...userData } = createUserDto;

      const newUSer = new this.userModel({
        password: bcryptjs.hashSync( password, 10),
        ...userData
      })

      await newUSer.save()
      // De esta forma la contraseña no sera visible cuando se crea el usuario
      const { password:_, ...user } = newUSer.toJSON()

      return user;

    } catch (error) {
      if( error.code === 1100){
        throw new BadRequestException( `${ createUserDto.email} already exists!`)
      }
      throw new InternalServerErrorException('Somenthing terrible happen!')
    }
    
    // 2. Guardar el usuario
    // 3. Generar el JWT

    // return newUSer.save();
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
