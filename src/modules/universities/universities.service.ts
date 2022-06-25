import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Subject} from "./entities/universities.interface";
const readXlsxFile = require('read-excel-file/node')
import xlsx from 'node-xlsx';
@Injectable()
export class UniversitiesService {
    private readonly currentYear:number = 2022;
    async find(subject,score) {
        if(subject === 'history'){
            return this.filterHistory(score);
        }else if(subject === 'physics'){
            return this.filterPhysics(score);
        }else{
            return '科目只支持"历史=history"或者"物理=physics"';
        }
    }

    async recommend(subject,score,limitNumber) {
        if(subject === 'history'){
            return this.historyRecommend(score);
        }else if(subject === 'physics'){
            return this.physicsRecommend(score);
        }else{
            return '科目只支持"历史=history"或者"物理=physics"';
        }
    }

    async findAll(subject:Subject,year) {
        const filename = `${year}/${year}-${subject}.xlsx`
        // Parse a file
        let data = this.readFile(filename);
        data.sort((a, b) => b[2] - a[2]);
        data = this.parseString(data);
        return data;
    }

    async findRankDetails(subject:Subject,year:number,score:number){
        const filename = `${year}/${year}-${subject}-rank.xlsx`
        // Parse a file
        const data = this.readFile(filename);
        const rank = this.findRank(data,subject,year,score);
        if(rank[0] >= data[0][0]){
            return {
                '分数':data[0][0],
                '同分人数':data[0][1],
                '排名':data[0][2],
                '提示':'恭喜你，你的分数已经突破天际，我们无法准确查到你的具体排名了！'
            };
        }else{
                return {
                    '分数':rank[0],
                    '同分人数':rank[1],
                    '排名':rank[2],
                };
        }
    }

    findRank(data,subject:Subject,year:number,score:number) {
        if(Number(score) >= data[0][0]) {
            return [score, 0, 0]
        }
        const result = data.find(function(item){
           if(item[0] === Number(score)){
            return item;
           }
        });
        return result;
    }

    private readFile(filename: string) {
        try{
            const workSheetsFromFile = xlsx.parse(`file/${filename}`);
            return workSheetsFromFile[0].data;
        }catch (error){
            throw new HttpException({message:'请求参数无效'}, HttpStatus.BAD_REQUEST);
        }
    }

    private async historyRecommend(score:number) {
        const rankData = this.readFile(`${this.currentYear}/${this.currentYear}-history-rank.xlsx`);
        const rank = this.findRank(rankData,'history',this.currentYear,score);
        if(rank[1]===0 && rank[2] === 0){
            return "恭喜你，你的分数已经突破天际，学校任你选！"
        }
        const lastRankData = this.readFile(`${this.currentYear-1}/${this.currentYear-1}-history-rank.xlsx`);
        const preRank = lastRankData.find(function(item){
            if(item[2]>=rank[2] ){
                return item;
            }
        });
         return {
             [`${this.currentYear}`]:{
                 '分数':rank[0],
                 '同分人数':rank[1],
                 '排名':rank[2],
             },
             [`${this.currentYear-1}`]:{
                 '分数':preRank[0],
                 '同分人数':preRank[1],
                 '排名':preRank[2],
             }

         };
    }

    private async physicsRecommend(score:number) {
        const rankData = this.readFile(`${this.currentYear}/${this.currentYear}-physics-rank.xlsx`);
        const rank = this.findRank(rankData,'physics',this.currentYear,score);
        if(rank[1]===0 && rank[2] === 0){
            return "恭喜你，你的分数已经突破天际，学校任你选！"
        }
        const lastRankData = this.readFile(`${this.currentYear-1}/${this.currentYear-1}-physics-rank.xlsx`);
        const preRank = lastRankData.find(function(item){
            if(item[2]>=rank[2] ){
                return item;
            }
        });
        return {
            [`${this.currentYear}`]:{
                '分数':rank[0],
                '同分人数':rank[1],
                '排名':rank[2],
            },
            [`${this.currentYear-1}`]:{
                '分数':preRank[0],
                '同分人数':preRank[1],
                '排名':preRank[2],
            }

        };
    }

    private async filterPhysics(score:number) {
        let data = this.readFile('2021/2021-physics.xlsx');

        data = this.filterAndDesc(data, score);
        data = this.parseString(data);
        return data;
    }


    private filterAndDesc(data: any[], score: number) {
        data = data.filter(s => s[2] <= score);
        data.sort((a, b) => b[2] - a[2]);
        return data;
    }

    private async filterHistory(score:number) {
        let data = this.readFile('2021/2021-history.xlsx');
        data = this.filterAndDesc(data, score);
        data = this.parseString(data);
        return data;
    }

    private parseString(data: any[]) {
        return data.map((item) => (
            {
                "院校代号": item[0],
                "院校、专业组（再选科目要求）": item[1],
                "投档最低分": item[2],
                "投档最低分同分考生排序项": {
                    "语数成绩": item[3],
                    "语数最高成绩": item[4],
                    "外语成绩": item[5],
                    "首选科目成绩": item[6],
                    "再选科目最高成绩": item[7],
                    "志愿号": item[8]
                }
            }
        ));
    }
}
