import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/messages/message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit { 
  messages: Message[] = [];

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.messages = this.messageService.getMessages();

    this.messageService.messageChangedEvent.subscribe((messages: Message[]) => {
      this.messages = messages;
    });
  }
  
}
