import { Component, ChangeDetectionStrategy, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { DMCanhBaoOutput, DMQuanLyCanhBaoServiceProxy } from '@shared/service-proxies/service-proxies';
import { forEach } from 'lodash';
import { interval, Subject, Subscription } from 'rxjs';
import { Message, MessageService } from 'primeng/api';
import { AppInitializer } from '../../../src/app-initializer';
import * as signalR from '@aspnet/signalr';
import { HttpClient } from '@angular/common/http';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { FileDownloadService } from '@shared/file-download.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService]
})
export class HeaderComponent extends AppComponentBase implements OnInit {
  subscription: Subscription;
  listNotifi: DMCanhBaoOutput[];
  changeColor: string;
  connection: signalR.HubConnection;
  connectionEstablished = new Subject<boolean>();
  constructor(
    injector: Injector,
    public http: HttpClient,
    private _messageService: MessageService,
    private _dmQuanLyCanhBaoAppService: DMQuanLyCanhBaoServiceProxy,
    private _fileDownloadService: FileDownloadService,
    public signalRService: AppInitializer,
    private _authService: AppAuthService,
  ) { super(injector); }

  // tslint:disable-next-line:cognitive-complexity
  ngOnInit(): void {
    this.hubCanhBao();
    this.hubLogOut();
  }

  playAudio(amThanh: number) {
    const audio = new Audio();
    if (amThanh === 1) {
      audio.src = '../assets/Loai1.wav';
    } else if (amThanh === 2) {
      audio.src = '../assets/Loai2.wav';
    } else if (amThanh === 3) {
      audio.src = '../assets/Loai3.wav';
    } else if (amThanh === 4) {
      audio.src = '../assets/Loai4.wav';
    } else if (amThanh === 5) {
      audio.src = '../assets/Loai5.wav';
    }
    audio.load();
    audio.play();
  }

  // tslint:disable-next-line:cognitive-complexity
  hubCanhBao() {
    this.http.get('../../assets/appconfig.json').subscribe(w => {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(w['remoteServiceBaseUrl'] + '/location', { transport: signalR.HttpTransportType.ServerSentEvents })
        .build();

      this.connection.start().then(() => {
        console.log('Đã khởi động Socket cảnh báo!');
        this.connectionEstablished.next(true);
      }).catch(err => console.log(err));

      this.connection.on('GetLocation', (input) => {
        this._dmQuanLyCanhBaoAppService.changeCanhBao(input).subscribe(canhBao => {
          if (canhBao !== undefined) {
            const thongbao = canhBao?.tenTram + ', mức độ: ' + canhBao?.mucDo + ', trạng thái: ' + canhBao?.trangThai;
            const check = JSON.parse(canhBao.giaTri);
            const popup = check != null ? check[canhBao.mucDo].popup : null;
            const amThanh = check != null ? check[canhBao.mucDo].sound : null;
            const mau = check != null ? check[canhBao.mucDo].color : null;
            if (mau === 1) {
              this.changeColor = '#EE1431';
            } else if (mau === 2) {
              this.changeColor = '#faab52';
            } else if (mau === 3) {
              this.changeColor = '#BBC806';
            } else if (mau === 4) {
              this.changeColor = '#34923a';
            } else if (mau === 5) {
              this.changeColor = '#888081';
            }

            if (popup === true) {
              const options1 = {
                timer: 10000,
                background: this.changeColor,
              };
              this.showWarningMessage(thongbao, canhBao?.loaiCanhBao, options1);
            }
            this.playAudio(amThanh);
            console.log('Cảnh báo', canhBao);
          }
        });
      });
    });
  }

  // tslint:disable-next-line:cognitive-complexity
  hubLogOut() {
    // tslint:disable-next-line:no-identical-functions
    this.http.get('../../assets/appconfig.json').subscribe(w => {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(w['remoteServiceBaseUrl'] + '/logout', { transport: signalR.HttpTransportType.ServerSentEvents })
        .build();

      this.connection.start().then(() => {
        console.log('Đã khởi động Socket logOut!');
        this.connectionEstablished.next(true);
      }).catch(err => console.log(err));

      this.connection.on('GetLogOut', (input) => {
        if (input.taiKhoanId === this.appSession.userId) {
          this._authService.logout();
        }
      });
    });
  }

  downloadApk() {
    this._dmQuanLyCanhBaoAppService.downloadFileAndroid().subscribe(result => {
      this._fileDownloadService.downloadTempFile(result);
    });
  }
}
