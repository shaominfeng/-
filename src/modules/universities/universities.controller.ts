import {Controller, Post, Body, Get, Param, HttpException, HttpStatus} from '@nestjs/common';
import {UniversitiesService} from "./universities.service";
import {Subject} from "./entities/universities.interface";

@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Get('subject/:subject/score/:score')
  filterUniversity(@Param('subject') subject: Subject,@Param('score') score: number) {
      return this.universitiesService.find(subject,score);
  }

  @Get('year/:year/subject/:subject')
  findAll(@Param('subject') subject: Subject,@Param('year') year: number) {
      return this.universitiesService.findAll(subject,year);
  }
}
