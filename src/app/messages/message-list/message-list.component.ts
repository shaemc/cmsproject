import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/messages/message.model'

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit { 
  messages: Message[] = [
    new Message('1', 'New Message', 'Hello!', 'Shae'),
    new Message('2', 'Another New Message', 'Hello there!', 'Shae'),
    new Message('3', 'Third New Message', 'Hello world!', 'Shae')
    ];

  constructor() { }

  ngOnInit(): void {
  }
  
  onAddMessage(message: Message) {
    this.messages.push(message);
  }

}
