import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})

export class ContactService {
  private contacts: Contact[] = [];

  contactSelectedEvent = new EventEmitter<Contact>();

  constructor() {
    this.contacts = MOCKCONTACTS;
  }

  getContacts() {
    return this.contacts.slice();
  }

  getContact(id: string): Contact {
    return this.contacts.find((contact) => contact.id === id);     
    }
  }

