import { Controller, Post, UseGuards, Request, Body, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from '../users/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Body() user: UserDto) {
        return await this.authService.login(user);
    }

    @Post('signup')
    async signUp(@Body() user: UserDto) {
        return await this.authService.create(user);
    }
}
