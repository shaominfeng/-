import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Subject} from "./entities/universities.interface";
const readXlsxFile = require('read-excel-file/node')
import xlsx from 'node-xlsx';
@Injectable()
export class UniversitiesService {
    async find(subject,score) {
        if(subject === '历史'){
            return this.filterHistory(score);
        }else if(subject === '物理'){
            return this.filterPhysics(score);
        }else{
            return '科目只支持"历史"或者"物理"';
        }
    }

    async findAll(subject:Subject,year) {
        let subjectFile = "physics";
        if(subject === '历史'){
            subjectFile = 'history';
        }
        const filename = `${year}/${year}-${subjectFile}.xlsx`
        // Parse a file
        let data = this.readFile(filename);
        data.sort((a, b) => b[2] - a[2]);
        data = this.parseString(data);
        return data;
    }

    private readFile(filename: string) {
        try{
            const workSheetsFromFile = xlsx.parse(`file/${filename}`);
            return workSheetsFromFile[0].data;
        }catch (error){
            throw new HttpException({message:'请求参数无效'}, HttpStatus.BAD_REQUEST);
        }
    }

    private async filterPhysics(score:number) {
        let data = this.readFile('file/2021/2021-physics.xlsx');

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
        let data = this.readFile('file/2021/2021-history.xlsx');
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
