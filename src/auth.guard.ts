import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authToken = request.headers.auth;

    // Handler (method)의 Metadata에서 Key(requireAuth) 에 대한 값을 추출
    const roles = this.reflector.get<boolean>(
      'requireAuth',
      context.getHandler()
    );
    if (!roles) {
      return true;
    }

    if (authToken === 'token') {
      return true;
    } else {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }
  }
}
