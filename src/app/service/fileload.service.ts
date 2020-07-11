import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileloadService {

  constructor() { }

  fileToText(file, isSJIS: boolean): Promise<string> {
    const reader = new FileReader();
    if (isSJIS){
      reader.readAsText(file, 'Shift_JIS');
    }
    else{
      reader.readAsText(file);
    }
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
    });
  }

  fileToArrayBuffer(file): Promise<ArrayBuffer> {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result as ArrayBuffer);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
    });
  }

  getExtension(filename: string): string{
    return '.' + filename.split('.').pop();
  }
}
