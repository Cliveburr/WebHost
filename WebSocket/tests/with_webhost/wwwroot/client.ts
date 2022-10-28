// import { WebHostWebSocket as client } from 'webhost-websocket/src/client/websocket';

// class ChatHub extends client.Path {

//     public static path = 'chat';
//     private receiveDiv: HTMLDivElement;

//     public constructor() {
//         super();
//         this.receiveDiv = <HTMLDivElement>document.getElementById('receive');
//     }

//     public send(user: string, msg: string): void {
//         super.call('send', user, msg);
//     }

//     public receive(user: string, msg: string): void {
//         let p = document.createElement('p');
//         p.innerText = user + ': ' + msg;
//         this.receiveDiv.appendChild(p);
//     }

//     public getclient(): string {
//         return navigator.platform;
//     }
// }


// let ws = new client.Host({
//     paths: [ChatHub]
// });
// ws.connect()
//     .then(() => {

//     let user = <HTMLInputElement>document.getElementById('user');
//     let msg = <HTMLInputElement>document.getElementById('msg');
//     let sender = <HTMLInputElement>document.getElementById('sender');

//     let chat = ws.getPath(ChatHub);

//     sender.onclick = (ev) => {

//         let userName = user.value;
//         if (!userName) {
//             alert('Must be have a name!');
//             return;
//         }

//         let userMsg = msg.value;
//         if (!userMsg) {
//             alert('Must be a msg!');
//             return;
//         }

//         chat.send(user.value, msg.value);
//     };
// });