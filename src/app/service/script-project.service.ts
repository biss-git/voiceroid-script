import { Injectable } from '@angular/core';
import { FileInfo } from '../@core/data/file-info';
import { ScriptProject } from '../model/script-project.model';

@Injectable({
  providedIn: 'root'
})
export class ScriptProjectService {

  constructor() { }


  project: ScriptProject ={
    scripts: [],
    characters: [],
    phraseDictionary: [],
    voicePreset: [],
    settings: [],
    fileLinks : [],
  }

  clearProject(){
    this.project ={
      scripts: [],
      characters: [],
      phraseDictionary: [],
      voicePreset: [],
      settings: [],
      fileLinks : [],
    }
  }

}
