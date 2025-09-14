import { Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction } from 'express';
import { UserResponseDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';

export class ApiKeyMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger(ApiKeyMiddleware.name);
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const apiKey: string | undefined = req.headers['x-api-key'] as string;

    if (!apiKey || typeof apiKey !== 'string') {
      this.logger.error('Invalid api key');
      throw new UnauthorizedException('User is not authorized');
    }

    const user: UserResponseDto | null =
      await this.userService.findByApiKey(apiKey);

    if (!user) {
      this.logger.error('User with the following api key does not exists');
      throw new UnauthorizedException('User is not authorized');
    }

    req['user'] = {
      id: user.id,
      agentId: '',
      elevenLabKey: '',
      phoneNumberId: '',
    };

    next();
  }
}
