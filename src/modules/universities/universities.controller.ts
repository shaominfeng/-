import {Controller, Post, Body, Get, Param, HttpException, HttpStatus} from '@nestjs/common';
import {UniversitiesService} from "./universities.service";
import {Subject} from "./entities/universities.interface";

@Controller('')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Get('universities/subject/:subject/score/:score')
  filterUniversity(@Param('subject') subject: Subject,@Param('score') score: number) {
      return this.universitiesService.find(subject,score);
  }

    @Get('universities/subject/:subject/score/:score/recommend/:limitNumber')
    universityRecommend(@Param('subject') subject: Subject,@Param('score') score: number,@Param('limitNumber') limitNumber: number) {
        return this.universitiesService.recommend(subject,score,limitNumber);
    }

  @Get('universities/year/:year/subject/:subject')
  findAll(@Param('subject') subject: Subject,@Param('year') year: number) {
      return this.universitiesService.findAll(subject,year);
  }

    @Get('ranks/year/:year/subject/:subject/score/:score/rank')
    findRank(@Param('subject') subject: Subject,@Param('year') year: number,@Param('score') score: number) {
        return this.universitiesService.findRankDetails(subject,year,score);
    }
}
