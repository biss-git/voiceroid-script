import { Pipe, PipeTransform } from '@angular/core';
import * as marked from 'marked'; // markedをインポート

@Pipe({
  name: 'mdToHtml'
})
export class MdToHtmlPipe implements PipeTransform {

  // 追加
  mdToHtml(md: string): any {
    return marked(md);
  }

  transform(value: any, args?: any): any {
    if(value == undefined){
      return '';
    }
    // pipeに流れてきた文字列をmarkedに渡す
    return this.mdToHtml(value);
  }

}
