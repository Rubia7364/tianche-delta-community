import { Controller, Post, Get, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Param('postId') postId: string,
    @Request() req,
    @Body() body: { content: string; parentId?: number },
  ) {
    return this.commentsService.create(+postId, req.user.userId, body.content, body.parentId);
  }

  @Get()
  async findByPost(
    @Param('postId') postId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.commentsService.findByPost(+postId, +page || 1, +limit || 20);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    return this.commentsService.delete(+id, req.user.userId);
  }
}
