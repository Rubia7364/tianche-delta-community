import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('teams')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() body: any) {
    return this.teamsService.create(req.user.userId, body);
  }

  @Get()
  async findAll(@Query('page') page: string, @Query('limit') limit: string) {
    return this.teamsService.findAll(+page || 1, +limit || 20);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  async join(@Param('id') id: string, @Request() req) {
    return this.teamsService.join(+id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/leave')
  async leave(@Param('id') id: string, @Request() req) {
    return this.teamsService.leave(+id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    return this.teamsService.delete(+id, req.user.userId);
  }
}
