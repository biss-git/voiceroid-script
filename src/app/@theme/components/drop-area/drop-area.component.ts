import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { NbThemeService, NbTable } from '@nebular/theme';
import { FileloadService } from '../../../service/fileload.service';
import { FileInfo } from '../../../@core/data/file-info';

@Component({
  selector: 'ngx-drop-area',
  templateUrl: './drop-area.component.html',
  styleUrls: ['./drop-area.component.scss']
})
export class DropAreaComponent implements OnInit, OnDestroy {

  @Input() text: string = '';
  @Input() type: string = 'UTF-8';
  @Input() selectVisible: boolean = false;

  @Output() fileLoad = new EventEmitter<FileInfo[]>();

  encoding: string = '';


  private files:FileInfo[] = [];

  constructor(private theme: NbThemeService,
              private fileload: FileloadService) { }

  bgColor = '#ffffff';
  dropAreaColor = '#eeeeee';

  private themeSubscription: any;

  ngOnInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      setTimeout(() => {
        this.bgColor = config.variables.bg.toString();
        this.dropAreaColor = this.bgColor;
      }, 10);
    });
  }

  ngOnDestroy(){
    this.themeSubscription.unsubscribe();
  }


  // ファイルを選択からファイルを読み込むとき
  onChangeInput(event) {
    if (event.target.files.length > 0){
      this.files = [];
      for(let i=0; i<event.target.files.length; i++){
        this.readFile(event.target.files[i], i==event.target.files.length-1);
      }
    }
  }

  // ファイルのドラッグ＆ドロップのとき
  drop(e){
    e.stopPropagation();
    e.preventDefault();
    if (e.dataTransfer.files.length > 0){
      this.files = [];
      for(let i=0; i<e.dataTransfer.files.length; i++){
        this.readFile(e.dataTransfer.files[i], i==e.dataTransfer.files.length-1);
      }
    }
    this.dropAreaColor = this.bgColor;
    return false;
  }
  dragover(e){
    e.stopPropagation();
    e.preventDefault();
    this.dropAreaColor = '#dddddd';
  }
  dragleave(e){
    e.stopPropagation();
    e.preventDefault();
    this.dropAreaColor = this.bgColor;
  }



  private readFile(file, isFinal:boolean){
    let extention: string = this.fileload.getExtension(file.name);
    if (this.type == 'bin'){
      extention = '';
    }
    switch(extention){
      case '.txt':
      case '.pdic':
      case '.vcha':
      case '.vois':
      case '.vpc':
      case '.settings':
      case '.voisproj':
        let isSJIS = false;
        if(extention == '.pdic'){
          isSJIS = true;
        }
        if(extention == '.txt'){
          isSJIS = (this.encoding == "" && this.type=="SJIS") ||
                   (this.encoding == 'sjis')
        }
        this.fileload.fileToText(file, isSJIS)
        .then(text => {
          const fileInfo: FileInfo = {
            name: file.name,
            extension: this.fileload.getExtension(file.name),
            content: text,
          }
          this.files.push(fileInfo);
          if(isFinal){
            setTimeout(() => {
              this.fileLoad.emit(this.files);
            }, 100);
          }
        })
        .catch(err => console.log(err));
        break;
      default:
        this.fileload.fileToArrayBuffer(file)
        .then(bitArray => {
          const fileInfo: FileInfo = {
            name: file.name,
            extension: this.fileload.getExtension(file.name),
            content: bitArray,
          }
          this.files.push(fileInfo);
          if(isFinal){
            this.fileLoad.emit(this.files);
          }
        })
        .catch(err => console.log(err));
        break;
    }
  }

}
