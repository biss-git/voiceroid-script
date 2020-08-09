import { FileInfo } from '../@core/data/file-info';

export class ScriptProject {
  scripts: FileInfo[];
  characters: FileInfo;
  phraseDictionary: FileInfo;
  voicePreset: FileInfo;
  settings: FileInfo;
  fileLinks: FileInfo[];
}
