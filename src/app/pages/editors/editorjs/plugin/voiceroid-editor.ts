import {API} from '@editorjs/editorjs';

//プラグインを構成するクラス
export default class VoiceroidEditor {

  static bgColor = '#ffff00';
  static textColor = '#0000ff';

  static characters = [
    { id: 0, name: '', src: '', isNull: true}
  ];


  private id: number = 0;

  private div: HTMLDivElement;
  private textInput: HTMLTextAreaElement;

  private initId: number = 0;
  private initText: string = '';
  private tempText: string = '';

  private api: API;


  constructor({data, config, api}) {
    this.api = api;
    if (data.text &&
       !(<string>data.text).includes('<textarea')){
      this.initText = data.text;
    }
    else{
      this.initText = '';
    }
    if (data.id){
      this.initId = data.id;
    }
  }

  //メニューバーにアイコンを表示
  static get toolbox() {
    return {
        title: 'Script',
        icon: '<i class="fas fa-images"></i>',
    };
  }

  //プラグインのUIを作成
  render(){

    this.div = document.createElement('div');

    this.textInput = document.createElement('textarea');
    this.textInput.classList.add('ce-paragraph', 'cdx-block');
    this.textInput.style.display = 'inline';
    this.textInput.style.border = '0';
    this.textInput.style.resize = 'none';
    this.textInput.style.width = '100%';
    this.textInput.style.backgroundColor = VoiceroidEditor.bgColor;
    this.textInput.style.color = VoiceroidEditor.textColor;
    this.textInput.onkeyup = this.onKeyUp.bind(this);
    this.textInput.onkeydown = this.onKeyDown.bind(this);
    this.textInput.setAttribute('rows', '1');

    this.div.appendChild(this.textInput);
    this.div.style.display = 'flex';
    this.div.style.alignItems = 'flex-start';
    this.div.style.userSelect = 'none';

    this.textInput.value = this.initText;
    this.initText = '';
    this.toggleTune(VoiceroidEditor.characters[this.initId]);
    setTimeout(() => {
      this.resizeTextArea();
    }, 10);

    return this.div;
  }

  private onKeyUp(e) {
    if (e.code == 'Tab'){
      this.tempText = this.textInput.value;
      /*
       * タブ押下時の挙動について
       * editor.js-master/src/components/modules/blockEvents.ts の tabPressedでclearSelectionを遅延実行することでTab押下時の挙動を修正した
       */
    }
    this.resizeTextArea();
  }

  private resizeTextArea(){
    const target = this.textInput;
    target.setAttribute('rows', '1');
    let lineHeight = Number(target.getAttribute('rows'));
    while (target.scrollHeight > target.offsetHeight){
      lineHeight++;
      target.setAttribute('rows', lineHeight.toString());
    }
  }

  private onKeyDown(e) {
    const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();

    if ( e.code == 'Backspace' &&
        this.api.blocks.getBlocksCount() > 1 &&
        this.textInput.selectionStart == 0 )
    {
      const deleteTargetIndex = currentBlockIndex + 1;

      const currentBlock = this.api.blocks.getBlockByIndex(currentBlockIndex);
      const targetBlock = this.api.blocks.getBlockByIndex(deleteTargetIndex);

      // 削除対象とイベントの発声したブロックが異なる場合は何もしない
      if ( targetBlock.getElementsByTagName('textarea')[0] != this.textInput){
        return;
      }

      // セルの先頭でbackspaceを押したときの処理
      currentBlock.getElementsByTagName('textarea')[0].value += this.textInput.value;
      this.api.blocks.delete(deleteTargetIndex);
    }


    // delete キーでパラグラフを削除するとき
    if ( e.code == 'Delete' &&
        this.textInput.value.length == this.textInput.selectionStart &&
        currentBlockIndex < this.api.blocks.getBlocksCount() - 1)
    {
      const nextIndex = currentBlockIndex + 1;
      const nextBlock = this.api.blocks.getBlockByIndex(nextIndex);
      this.textInput.value += nextBlock.getElementsByTagName('textarea')[0].value;
      this.api.blocks.delete(nextIndex);
    }

    // Enter キーで改行するとき
    if ( e.code == 'Enter')
    {
      const newBlock = this.api.blocks.getBlockByIndex(currentBlockIndex);
      if (newBlock.getElementsByTagName('textarea')[0] == this.textInput){
        // Enter押下時に新しいブロックが作られていなければ何もしない
        return;
      }
      newBlock.getElementsByTagName('textarea')[0].value = this.textInput.value.substr(this.textInput.selectionStart);
      this.textInput.value = this.textInput.value.substr(0, this.textInput.selectionStart);
    }

    /*
     * api.blocks.delete(index)の挙動について
     * editor.js-master/src/components/modules/api/blocks.ts の delete()がblockIndexを受け取っていなかったので修正した
     */
  }


  validate(savedData) {
    return true;
  }

  //保存時のデータを抽出
  save(data){
    return {
      id: this.id,
      text: this.textInput.value,
    };
  }

  renderSettings(){
    const wrapper = document.createElement('div');

    VoiceroidEditor.characters.forEach( tune => {
      const button = document.createElement('div');

      button.classList.add('cdx-settings-button');
      const img = '<img width="30" height="30" style="margin: 2px;" src="' + tune.src + '" alt="画像"></img>';
      button.innerHTML = img;
      wrapper.appendChild(button);

      button.addEventListener('click', () => {
        this.toggleTune(tune);
        button.classList.toggle('cdx-settings-button--active');
      });
    });

    return wrapper;
  }

  private toggleTune(tune) {
    this.id = tune.id;
    let imag: string;
    if(tune.isNull){
      imag = '<img width="50" height="10" style="flex: 0 0 50px; margin-right: 10px; margin-top: 6px;" src="assets/images/null.png" alt=""></img>';
    }
    else{
      imag = '<img width="50" height="50" style="flex: 0 0 50px; margin-right: 10px; margin-top: 6px;" src="' + tune.src + '" alt="' + tune.name + '"></img>';
    }
    this.div.innerHTML = imag;
    this.div.appendChild(this.textInput);
    if (this.tempText){
      this.textInput.value = this.tempText;
    }
    setTimeout(() => {
      this.textInput.selectionStart = this.textInput.value.length;
    }, 100);
    this.api.toolbar.close();
    this.api.tooltip.hide();
  }

}

