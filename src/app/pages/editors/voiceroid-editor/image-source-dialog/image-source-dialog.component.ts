import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { CharactorsService } from '../../../../service/charactors.service';
import { Character } from '../../../../model/character.model';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-image-source-dialog',
  templateUrl: './image-source-dialog.component.html',
  styleUrls: ['./image-source-dialog.component.scss'],
})
export class ImageSourceDialogComponent {

  chara: Character;
  url: FormControl;
  name: FormControl;
  sources: string[];

  constructor(
    protected ref: NbDialogRef<ImageSourceDialogComponent>,
    public charaService: CharactorsService) {
      this.chara = {
        name: this.charaService.selectedChara.name,
        src: this.charaService.selectedChara.src,
      } as Character;
      this.url = new FormControl(this.chara.src, [Validators.required]);
      this.name = new FormControl(this.chara.name, [Validators.required]);
      this.sources = this.charaService.sources;
  }

  cancel(): void {
    this.ref.close();
  }

  submit(): void {
    this.chara.name = this.name.value;
    this.chara.src = this.url.value;
    this.ref.close(this.chara);
  }

  select(src: string): void {
    this.url.setValue(src);
  }

}
