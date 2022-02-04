import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message;

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
