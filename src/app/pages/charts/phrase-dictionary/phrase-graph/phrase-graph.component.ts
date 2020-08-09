import { AfterViewInit, Component, OnDestroy, Input, TemplateRef } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { PhraseService } from '../../../../service/phrase.service';
//import * as Plotly from 'plotly.js';
import * as Plotly from 'plotly.js/dist/plotly-basic.min.js';
import { Subscription } from 'rxjs';
import { NbDialogService } from '@nebular/theme';
import { DownloadService } from '../../../../service/download.service';
import { LayoutService } from '../../../../@core/utils';

@Component({
  selector: 'ngx-phrase-graph',
  templateUrl: './phrase-graph.component.html',
  styleUrls: ['./phrase-graph.conponent.scss'],
})
export class PhraseGraphComponent implements AfterViewInit, OnDestroy  {

  constructor(private theme: NbThemeService,
    private phraseService: PhraseService,
    private dialogService: NbDialogService,
    private downloadService: DownloadService,
    private layoutService: LayoutService) {}

  checked = false; // グラフを纏めるかどうか
  imgSrc = ''; // コピー用画像のurl

  imageWidth = 1000;
  imageHeight = 600;

  id = 'graph'; // グラフ用のid 複数使う場合は id を分ける必要があるので、インプットできるようにしている
  @Input()
  set graphid(value: string) {
    this.id = (value && value.trim()) || '<no name set>';
  }
  get graphid() { return this.id; }

  private themeSubscription: any; // テーマの変更を受け取るやつ
  private phraseSubscription: Subscription;  // フレーズデータの変更を受け取るやつ
  private layoutSubscription: any; //


  ngAfterViewInit() {

    // テーマが変わったとき
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.drawGraph(true);
    });

    // フレーズデータが変更されたとき
    this.phraseSubscription = this.phraseService.dataChange.subscribe(data => {
      this.drawGraph(false);
    });

    this.layoutSubscription = this.layoutService.onChangeLayoutSize().subscribe( change => {
      this.resizeGraph();
    });
  }

  ngOnDestroy(): void {
    // 後処理　購読の終了
    this.themeSubscription.unsubscribe();
    this.phraseSubscription.unsubscribe();
    this.layoutSubscription.unsubscribe();
  }


  // グラフの更新
  private drawGraph(isNew: boolean){
    // フレーズデータの取得
    this.layout.title = this.phraseService.title;
    const phrase = this.phraseService.value;

    let graph;
    try{
      // グラフデータに変換
      graph = this.phraseService.phraseToGraph(phrase);
    }
    catch (e){
      console.log('フレーズの読込に失敗しました。');
      console.log(e);
      return;
    }

    this.data[0].x = graph['moras'];
    this.data[0].y = graph['acc'];
    this.data[1].x = graph['moras_vol'];
    this.data[1].y = graph['vol'];
    //this.data[1].text = graph['vol_text'];
    this.data[2].x = graph['moras_spd'];
    this.data[2].y = graph['spd'];
    //this.data[2].text = graph['spd_text'];
    this.data[3].x = graph['moras_pit'];
    this.data[3].y = graph['pit'];
    //this.data[3].text = graph['pit_text'];
    this.data[4].x = graph['moras_emp'];
    this.data[4].y = graph['emp'];
    //this.data[4].text = graph['emp_text'];
    this.data[5].x = graph['moras_pau'];
    this.data[5].y = graph['pau'];
    this.data[5].text = graph['pau_text'];
    this.data[5].marker.size = graph['pau_size'];

    this.layout.xaxis.tickvals = graph['moras'];
    this.layout.xaxis.ticktext = graph['moras_text'];

    // 注釈の作成
    const annotations: Plotly.Annotations[] = [];
    for (let num = 1; num <= 4; num++){
      for ( let i = 0; i < this.data[num].x.length; i++){
        const anno: Plotly.Annotations = {
          text: (this.data[num].y[i] as number).toFixed(2),
          xref: 'x',
          xanchor: 'left',
          x: this.data[num].x[i],
          yref: this.data[num].yaxis,
          yanchor: 'bottom',
          y: this.data[num].y[i],
          ax: 0,
          ay: 0,
        } as Plotly.Annotations;
        annotations.push(anno);
      }
    }
    this.layout.annotations = annotations;

    // グラフ作成
    if (isNew){
      // 新規に作成
      Plotly.newPlot(this.id, this.data, this.layout, this.options);
    }
    else{
      // 更新のみ
      Plotly.update(this.id, {}, {});
      Plotly.redraw(this.id);
    }
    this.resizeGraph();

  }

  // グラフのリサイズ
  resizeGraph(){
    Plotly.Plots.resize(this.id);
  }

  // グラフをまとめるとバラバラの切り替え
  onClick(){
    setTimeout(() => {
      if (this.checked){
        // グラフをまとめる
        Plotly.update(this.id, {}, {
          yaxis: {zeroline: false, autorange: false, range: [-0.05, 2.05], title: ''},
          yaxis2: {visible: false, autorange: false, range: [-0.05, 2.05], overlaying: 'y', title: ''},
          yaxis3: {visible: false, autorange: false, range: [-0.05, 2.05], overlaying: 'y', title: ''},
          yaxis4: {visible: false, autorange: false, range: [-0.05, 2.05], overlaying: 'y', title: ''},
          yaxis5: {visible: false, autorange: false, range: [-0.05, 2.05], overlaying: 'y', title: ''},
        });
      }
      else{
        // グラフをバラバラにする
        Plotly.update(this.id, {}, {
          yaxis: {domain: [0.00, 0.11], visible: false, autorange: false, range: [-0.05, 2.05], title: ''}, // アクセント
          yaxis2: {domain: [0.80, 1.00], color: 'rgb(190,190,190)', zeroline: false, autorange: false, range: [-0.05, 2.05], title: ''},  // 音量
          yaxis3: {domain: [0.57, 0.77], color: 'rgb(190,190,190)', zeroline: false, autorange: false, range: [-0.05, 2.05], title: ''}, // 話速
          yaxis4: {domain: [0.34, 0.54], color: 'rgb(190,190,190)', zeroline: false, autorange: false, range: [-0.05, 2.05], title: ''}, // 高さ
          yaxis5: {domain: [0.11, 0.31], color: 'rgb(190,190,190)', zeroline: false, autorange: false, range: [-0.05, 2.05], title: ''},  // 抑揚
        });
      }
      this.redrawImage();
    }, 10);
  }

  // 画像のダウンロード
  downloadImage(){
    this.generateImage(true);
  }

  // コピー用画像の表示
  openImage(dialog: TemplateRef<any>) {
    this.generateImage(false);
    this.dialogService.open(dialog);
  }

  // コピー用画像の再表示
  redrawImage() {
    this.generateImage(false);
  }

  // 画像生成
  private generateImage(withDownload: boolean){
    this.imageHeight = Math.round( Math.max(100, Math.min(this.imageHeight, 4000)) );
    this.imageWidth = Math.round( Math.max(100, Math.min(this.imageWidth, 4000)) );
    Plotly.newPlot(this.id, this.data, this.layout, this.options)
    .then((gd) => {
      Plotly.toImage(gd, {format: 'png', height: this.imageHeight, width: this.imageWidth}as Plotly.ToImgopts)
      .then((url) => {
        if (withDownload){
          this.downloadService.download(url, this.layout.title['text'].toString(), true, '.png');
        }
        this.imgSrc = url;
      });
    });
  }


  // 以下はグラフの設定などの色々細かいやつ

    // グラフ用のデータ
    private data = [
      {
        name: 'アクセント',
        x: [],
        y: [],
        mode: 'lines+markers',
        type: 'scatter',
        yaxis: 'y',
        line: {
          color: 'rgb(192,192,192)',
        },
        marker: {
          size: 12,
        },
        hovertemplate: '%{x}',
      } as Plotly.ScatterData,
      {
        name: '音量',
        x: [],
        y: [],
        mode: 'lines+markers',
        textposition: 'top right',
        type: 'scatter',
        yaxis: 'y2',
        line: {
          color: 'rgb(216,0,0)',
          shape: 'hv',
        },
        marker: {
          color: 'rgb(32,32,32)',
          symbol: 'square',
        },
        //hovertemplate: '%{y:.2f} %{text}',
        hovertemplate: '%{y:.2f}',
      } as Plotly.ScatterData,
      {
        name: '話速',
        x: [],
        y: [],
        mode: 'lines+markers',
        textposition: 'top right',
        type: 'scatter',
        yaxis: 'y3',
        line: {
          color: 'rgb(0,128,0)',
          shape: 'hv',
        },
        marker: {
          color: 'rgb(32,32,32)',
          symbol: 'square',
        },
        //hovertemplate: '%{y:.2f} %{text}',
        hovertemplate: '%{y:.2f}',
      } as Plotly.ScatterData,
      {
        name: '高さ',
        x: [],
        y: [],
        mode: 'lines+markers',
        textposition: 'top right',
        type: 'scatter',
        yaxis: 'y4',
        line: {
          color: 'rgb(230,150,0)',
          shape: 'hv',
        },
        marker: {
          color: 'rgb(32,32,32)',
          symbol: 'square',
        },
        //hovertemplate: '%{y:.2f} %{text}',
        hovertemplate: '%{y:.2f}',
      } as Plotly.ScatterData,
      {
        name: '抑揚',
        x: [],
        y: [],
        mode: 'lines+markers',
        textposition: 'top right',
        type: 'scatter',
        yaxis: 'y5',
        line: {
          color: 'rgb(216,108,216)',
          shape: 'hv',
        },
        marker: {
          color: 'rgb(32,32,32)',
          symbol: 'square',
        },
        //hovertemplate: '%{y:.2f} %{text}',
        hovertemplate: '%{y:.2f}',
      } as Plotly.ScatterData,
      {
        name: 'ポーズ',
        x: [],
        y: [],
        mode: 'text+markers',
        textposition: 'bottom center',
        type: 'scatter',
        yaxis: 'y',
        line: {
          color: 'rgb(135,206,235)',
        },
        marker: {
          size: 12,
        },
        hovertemplate: '%{text}',
      } as Plotly.ScatterData,
    ];

    // グラフのレイアウト
    private layout = {
      height: 600,
      hoverlabel: {
        bgcolor: '#FFF',
      },
      xaxis: {
        tickangle: 0,
        zeroline: false,
        title: '',
      },
      yaxis: {
        // アクセント
        domain: [0.0, 0.11],
        visible: false,
        showgrid: false,
        zeroline: false,
        showline: false,
        autorange: false,
        range: [-0.05, 2.05],
        title: '',
      },
      yaxis2: {
        // 音量
        domain: [0.8, 1.0],
        color: 'rgb(190,190,190)',
        zeroline: false,
        autorange: false,
        range: [-0.05, 2.05],
        title: '',
      },
      yaxis3: {
        // 話速
        domain: [0.57, 0.77],
        color: 'rgb(190,190,190)',
        zeroline: false,
        autorange: false,
        range: [-0.05, 2.05],
        title: '',
      },
      yaxis4: {
        // 高さ
        domain: [0.34, 0.54],
        color: 'rgb(190,190,190)',
        zeroline: false,
        autorange: false,
        range: [-0.05, 2.05],
        title: '',
      },
      yaxis5: {
        // 抑揚
        domain: [0.11, 0.31],
        color: 'rgb(190,190,190)',
        zeroline: false,
        autorange: false,
        range: [-0.05, 2.05],
        title: '',
      },
      updatemenus: {},
      annotations: [],
    } as Plotly.Layout;

  private options: Plotly.Config = {
    displaylogo: false,
    responsive: true,
    modeBarButtonsToRemove: ['lasso2d' , 'select2d' , 'zoomIn2d' , 'zoomOut2d' , 'autoScale2d' , 'toggleSpikelines' ],
    doubleClick: 'reset',
    editable: true,
    displayModeBar: true,
  } as Plotly.Config;

}
