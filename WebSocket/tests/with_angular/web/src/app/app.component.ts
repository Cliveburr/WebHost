import { Component } from '@angular/core';
import { ChatClientHub } from './chat.clienthub';

@Component({
  selector: 'app-root',
  template: `
    <h1>WebHost Chat with WebSocket Example</h1>
    <div>
        Sender: <input type="text" [(ngModel)]="sender" />
        <br />
        Message: <input type="text" [(ngModel)]="msg" />
        <br />
        <input type="button" value="Send" (click)="send_msg()" />
        <input type="button" value="Log on Server" (click)="log_on_server()" />
        <input type="button" value="Test server error" (click)="test_server_error()" />
    </div>
    <br />
    <span *ngFor="let msg of msgs">
      {{msg}}<br />
    </span>
  `,
  styles: []
})
export class AppComponent {
  
  public sender: string;
  public msg: string;
  public msgs: string[];
  
  public constructor(
    public chat: ChatClientHub
  ) {
    this.msgs = [];
    this.chat.showMsg = this.showMsg.bind(this);
  }

  public ngOnInit(): void {
    //this.title = new Test1().value;
  }

  public send_msg(): void {
        if (!this.sender) {
            alert('Must be have a sender!');
            return;
        }

        if (!this.msg) {
            alert('Must be a msg!');
            return;
        }

        this.chat.call.sendMsg(this.sender, this.msg);    
  }

  private showMsg(user: string, msg: string): void {
    this.msgs.push(user + ': ' + msg);
  }

  public async log_on_server(): Promise<void> {
    this.chat.call.logOnServer();
  }

  public async test_server_error(): Promise<void> {
    try {
      const valueFromServer = await this.chat.call.testServerError();
    }
    catch (error) {
      console.error(error);
    }
    const valueFromServer = await this.chat.call.testServerError();
  }
}
