import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { Message } from './message.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new Subject<Message[]>();
  maxMessageId: number;
  subscription: Subscription;

  constructor(private http: HttpClient) {
    // this.messages = MOCKMESSAGES;
  }

  addMessage(message: Message) {
      this.messages.push(message);
      // this.messageChangedEvent.next(this.messages.slice());
      this.storeMessage();
  }

  getMessages() {
    return this.http
        .get(
            'https://wdd430-winter2022-7137c-default-rtdb.firebaseio.com/messages.json'
            )
        .subscribe(
        // success method
        (messages: Message[]) => {
           this.messages = messages;
           this.maxMessageId = this.getMaxId();

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

  storeMessage() {
    let messages = JSON.stringify(this.messages);

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http
    .put(
        'https://wdd430-winter2022-7137c-default-rtdb.firebaseio.com/messages.json',
        messages,
        {
            headers: headers,
        }
    )
    .subscribe(() => {
        this.messageChangedEvent.next(this.messages.slice());
    });
}

  getMessage(id: string): Message {
    return this.messages.find((message) => message.id === id);     
    }

    getMaxId(): number {
      let maxId = 0
  
      for (const message of this.messages){
          let currentId = parseFloat(message.id);
      
          if (currentId > maxId){
              maxId = currentId
          }
      }        
      return maxId;
  }
  }

