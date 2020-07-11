import { Injectable } from '@angular/core';
import { FileInfo } from '../@core/data/file-info';

@Injectable({
  providedIn: 'root'
})
export class ScriptProjectService {

  constructor() { }


  project:any ={
    scripts: [],
    characters: [],
    phraseDictionary: [],
    voicePreset: [],
    settings: [],
    fileLinks : [],
  }

}
