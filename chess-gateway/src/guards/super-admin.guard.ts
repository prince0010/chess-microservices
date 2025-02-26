import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { SecurityRoles } from 'src/enum';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      // Call to auth-ms to validate token or not
      const { user, token: newToken } = await firstValueFrom(
        this.client.send('auth.verify.user', token),
      );

      if (!user.roles.includes(SecurityRoles.SUPER_ADMIN)) {
        throw new UnauthorizedException(
          'User does not have Super_Admin required role to access this endpoint.',
        );
      }

      request['user'] = user;
      request['token'] = newToken;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
