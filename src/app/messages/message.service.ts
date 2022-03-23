import { Injectable } from '@angular/core';
import { Message } from './message.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new Subject<Message[]>();
  // maxMessageId: number;
  subscription: Subscription;

  constructor(private http: HttpClient) {
    // this.messages = MOCKMESSAGES;
    // this.maxMessageId = this.getMaxId();

  }

  sortAndSend() {
    // this.messages.sort((a, b) =>
    //    a._id > b._id ? 1 : b._id > a._id ? -1 : 0
    //    );

       this.messageChangedEvent.next(this.messages.slice());
  }

//   deleteMessage(message: Message) {
//     if (!message) {
//        return;
//     }
//     const pos = this.messages.findIndex(m => m.id === message.id);
//     if (pos < 0) {
//        return;
//     }
//     this.http.delete('http://localhost:3000/messages/' + message.id)
//     .subscribe(
//       (response: Response) => {
//         this.messages.splice(pos, 1);
//         this.sortAndSend();
//       }
//     );
//  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }

    // make sure id of the new Document is empty
    message.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ response: string, newMessage: Message }>('http://localhost:3000/messages',
      message,
      { headers: headers })
      .subscribe(
        (responseData) => {
          console.log(responseData);
          message._id = responseData.newMessage._id;
          message.id = responseData.newMessage.id;
          // add new document to documents
          this.messages.push(message);
          this.sortAndSend();
        }
      );

      // this.messages.push(message);
      // // this.messageChangedEvent.next(this.messages.slice());
      // this.storeMessage();
  }

  getMessages() {
    return this.http
        .get<{ message: string, messages: Message[] }>(
            'http://localhost:3000/messages'
            )
        .subscribe(
        // success method
        (responseData) => {
           this.messages = responseData.messages;
          //  this.maxMessageId = this.getMaxId();

           this.messages.sort((a, b) =>
           a.id > b.id ? 1 : b.id > a.id ? -1 : 0
           );

           this.messageChangedEvent.next(this.messages.slice());
        },
        // error method
        (error: any) => {
           console.log(error)
        }
        );
  }

//   storeMessage() {
//     let messages = JSON.stringify(this.messages);

//     const headers = new HttpHeaders({'Content-Type': 'application/json'});

//     this.http
//     .put(
//         'localhost:27017/cms/messages',
//         messages,
//         {
//             headers: headers,
//         }
//     )
//     .subscribe(() => {
//         this.messageChangedEvent.next(this.messages.slice());
//     });
// }

// updateMessage (originalMessage: Message, newMessage: Message){
//   if (!originalMessage || !newMessage){
//       return;
//   }

//   const pos = this.messages.findIndex(m => m.id === originalMessage.id)

//   if (pos < 0) {
//       return;
//   }

//   newMessage.id = originalMessage.id;
//   newMessage._id = originalMessage._id;

//   const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
//   this.http.put('http://localhost:3000/messages/' + originalMessage.id,
//     newMessage, { headers: headers })
//     .subscribe(
//       (response: Response) => {
//         this.messages[pos] = newMessage;
//         this.sortAndSend();
//       }
//     );

//   this.storeMessage();
// }

  getMessage(id: string) {
    return this.http.get<{ message: Message }> ('http://localhost:3000/messages/' + id);     
    }
  }

