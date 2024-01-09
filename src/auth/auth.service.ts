import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';

import { CreateUserDto, UpdateAuthDto, RegisterUserDto, LoginDto } from './dto';

import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';


@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>,
    private jwtService: JwtService
    ) {}

  async create(createUserDto: CreateUserDto) {
       
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
  }

  async register( registerDto: RegisterUserDto ): Promise<LoginResponse> {

    const user = await this.create( registerDto );
    console.log({user})

    return {
      user: user,
      token: this.getJwtToken({ id: user._id })
    }
  }

  async login( loginDto: LoginDto ):Promise <LoginResponse> {

    const { email, password } = loginDto;

    // Verificar si el usuario existe
    const user = await this.userModel.findOne({ email: email });
    if ( !user ) {
      throw new UnauthorizedException('Not valid credentials - email');
    }
    
    // Verificar la contraseña
    if ( !bcryptjs.compareSync( password, user.password ) ) {
      throw new UnauthorizedException('Not valid credentials - password');
    }

    const { password:_, ...dataUser  } = user.toJSON();

      
    return {
      user: dataUser,
      token: this.getJwtToken({ id: user.id }),
    }
  
  }

  getJwtToken( payload: JwtPayload ) {
    const token = this.jwtService.sign(payload);
    return token;
  }


  findAll():Promise<User[]>{
    return this.userModel.find();
  }

  async findUserById( id: string ) {
    const user = await this.userModel.findById( id );
    const { password, ...dataUser } = user.toJSON();
    return dataUser;
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
