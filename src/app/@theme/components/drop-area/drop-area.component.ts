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

  @Output() fileLoad = new EventEmitter<FileInfo>();


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
      const file = event.target.files[0];
      this.readFile(file);
    }
  }

  // ファイルのドラッグ＆ドロップのとき
  drop(e){
    e.stopPropagation();
    e.preventDefault();
    if (e.dataTransfer.files.length > 0){
      const file = e.dataTransfer.files[0];
      this.readFile(file);
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



  private readFile(file){
    this.fileload.fileToText(file, this.type=="SJIS")
      .then(text => {
        const fileInfo: FileInfo = {
          name: file.name,
          extension: this.fileload.getExtension(file.name),
          content: text,
        }
        this.fileLoad.emit(fileInfo);
      })
      .catch(err => console.log(err));
  }

}
