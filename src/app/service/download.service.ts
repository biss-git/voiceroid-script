import { Injectable } from '@angular/core';
import Encoding from 'encoding-japanese';
import { FileInfo } from '../@core/data/file-info';

@Injectable({
  providedIn: 'root',
})

// ファイルのダウンロード処理をまとめたサービス
export class DownloadService {

  constructor() { }

  // 日付を書式指定して文字列にするやつ
  private dateFormat = {
    _fmt : {
      'yyyy': function(date) { return date.getFullYear() + ''; },
      'MM': function(date) { return ('0' + (date.getMonth() + 1)).slice(-2); },
      'dd': function(date) { return ('0' + date.getDate()).slice(-2); },
      'hh': function(date) { return ('0' + date.getHours()).slice(-2); },
      'mm': function(date) { return ('0' + date.getMinutes()).slice(-2); },
      'ss': function(date) { return ('0' + date.getSeconds()).slice(-2); },
    },
    _priority : ['yyyy', 'MM', 'dd', 'hh', 'mm', 'ss'],
    format: function(date, format){
      return this._priority.reduce((res, fmt) => res.replace(fmt, this._fmt[fmt](date)), format);
    },
  };

  /**
   * ファイルをダウンロードする
   *
   * @param url ダウンロードurl
   * @param filename 保存ファイル名
   * @param withDate 保存ファイル名に日付を追加するかどうか
   * @param extension 拡張子　".png" みたいな感じ
   */
  download(url: string, filename: string, withDate: boolean, extension: string){
    const a = document.createElement('a');
    document.body.appendChild(a);
    const date = new Date();
    if ( withDate ) {
      a.download =  filename + this.dateFormat.format(date, '_yyyyMMdd_hhmm') + extension;
    }
    else{
      a.download =  filename + extension;
    }
    a.href = url;
    a.click();
    a.remove();
  }

  /**
   * テキストファイルをダウンロードする
   *
   * @param url ダウンロードurl
   * @param filename 保存ファイル名
   * @param withDate 保存ファイル名に日付を追加するかどうか
   * @param extension 拡張子　".txt" みたいな感じ
   */
  downloadText(text: string, filename: string, withDate: boolean, extension: string, isSJIS: boolean = false){
    let blob: Blob;
    if(isSJIS){
      blob = new Blob([this.toShiftJIS(text)], {type: 'text/plain'});
    }else{
      blob  = new Blob([text], {type: 'text/plain'});
    }
    const url = URL.createObjectURL(blob);
    this.download(url, filename, withDate, extension);
    URL.revokeObjectURL(url);
  }


  downloadFile(file: FileInfo){
    let blob: Blob;
    if(file.extension == ".pdic"){
      blob = new Blob([this.toShiftJIS(file.content)], {type: 'text/plain'});
    }
    else{
      blob = new Blob([file.content], {type: 'text/plain'});
    }
    const url = URL.createObjectURL(blob);
    this.download(url, file.name, false, '');
    URL.revokeObjectURL(url);
  }



  toShiftJIS(utf8String: string) {
    const detected = Encoding.detect(utf8String)
    const unicodeList = []

    for (let i = 0; i < utf8String.length; i += 1) {
        unicodeList.push(utf8String.charCodeAt(i))
    }

    const sjisArray = Encoding.convert(unicodeList, {
        to: 'SJIS',
        from: detected
    })
    return new Uint8Array(sjisArray)
}

}
