import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() body: any) {
    return this.postsService.create(req.user.userId, body);
  }

  @Get()
  async findAll(@Query('page') page: string, @Query('limit') limit: string, @Query('sort') sort: string) {
    return this.postsService.findAll(+page || 1, +limit || 20, sort || 'latest');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async like(@Param('id') id: string, @Request() req) {
    return this.postsService.like(+id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  async unlike(@Param('id') id: string, @Request() req) {
    return this.postsService.unlike(+id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    return this.postsService.delete(+id, req.user.userId);
  }
}
