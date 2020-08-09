import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { CharactorsService } from '../../../../service/charactors.service';
import { Character } from '../../../../model/character.model';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-image-source-dialog',
  templateUrl: './image-source-dialog.component.html',
  styleUrls: ['./image-source-dialog.component.scss']
})
export class ImageSourceDialogComponent {

  chara: Character;
  url: FormControl;
  sources: string[];

  constructor(
    protected ref: NbDialogRef<ImageSourceDialogComponent>,
    private charaService: CharactorsService,) {
      this.chara = this.charaService.selectedChara;
      this.url = new FormControl(this.chara.src,[Validators.required])
      this.sources = this.charaService.sources;
  }

  cancel(): void {
    this.ref.close();
  }

  submit(name): void {
    this.ref.close(name);
  }

  select(src: string): void {
    this.url.setValue(src);
  }

}
