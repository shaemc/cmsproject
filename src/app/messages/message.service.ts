import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  private messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>();

  constructor() {
    this.messages = MOCKMESSAGES;
  }

  addMessage(message: Message) {
      this.messages.push(message);
      this.messageChangedEvent.emit(this.messages.slice());
  }

  getMessages(): Message[] {
    return this.messages.slice();
  }

  getMessage(id: string): Message {
    return this.messages.find((message) => message.id === id);     
    }
  }

