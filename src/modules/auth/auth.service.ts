import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(username: string, pass: string) {
        // find out if an existing user is attached to the given email
        const user = await this.userService.findOneByEmail(username);

        if (!user) return null;

        // check if the passwords match
        const match = await this.comparePassword(pass, user.password);
        if (!match) return null;

        const { password, ...result} = user['dataValues'];
        return result;
    }

    public async login(user: UserDto): Promise<{user: UserDto, token: string}> {
        const token = await this.generateToken(user);
        return { user, token };
    }

    public async create(user: UserDto): Promise<{user: UserDto, token: string}> {
        // hash the password
        const pass = await this.hashPassword(user.password);

        // create the user
        const newUser = await this.userService.create({ ...user, password: pass });

        // tslint:disable-next-line: no-string-literal
        const { password, ...result } = newUser['dataValues'];

        // generate token
        const token = await this.generateToken(result);

        // return the user and the token
        return { user: result, token };
    }


    private async generateToken(user: UserDto): Promise<string> {
        const token = await this.jwtService.signAsync(user);
        return token;
    }

    private async hashPassword(password) {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    private async comparePassword(enteredPassword: string, dbPassword: string) {
        const match = await bcrypt.compare(enteredPassword, dbPassword);
        return match;
    }
}
