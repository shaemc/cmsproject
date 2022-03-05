import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class ContactService {
  contacts: Contact[] = [];
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;

  constructor(private http: HttpClient) {
    // this.contacts = MOCKCONTACTS;
  }

  getContacts() {
    return this.http
    .get(
        'https://wdd430-winter2022-7137c-default-rtdb.firebaseio.com/contacts.json'
        )
    .subscribe(
    // success method
    (contacts: Contact[]) => {
       this.contacts = contacts;
       this.maxContactId = this.getMaxId();

       this.contacts.sort((a, b) =>
       a.name > b.name ? 1 : b.name > a.name ? -1 : 0
       );

       this.contactListChangedEvent.next(this.contacts.slice());
    },
    // error method
    (error: any) => {
       console.log(error)
    }
    );

    // return this.contacts.slice();
  }

  getContact(id: string): Contact {
    return this.contacts.find((contact) => contact.id === id);     
    }

  deleteContact(contact: Contact) {
    if (!contact) {
       return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
       return;
    }
    this.contacts.splice(pos, 1);

    this.contactListChangedEvent.next(this.contacts.slice());
    this.storeContact();
 }

 addContact(newContact: Contact) {
  if (!newContact) {
      return;
  }

  this.maxContactId++;

  newContact.id = this.maxContactId.toString();

  this.contacts.push(newContact);
  
  const contactsListClone = this.contacts.slice();

  this.storeContact()
  // this.contactListChangedEvent.next(contactsListClone);
}

storeContact() {
  let contacts = JSON.stringify(this.contacts);

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  this.http
  .put(
      'https://wdd430-winter2022-7137c-default-rtdb.firebaseio.com/contacts.json',
      contacts,
      {
          headers: headers,
      }
  )
  .subscribe(() => {
      this.contactListChangedEvent.next(this.contacts.slice());
  });
}

updateContact(originalContact: Contact, newContact: Contact){
  if (!originalContact || !newContact){
      return;
  }

  const pos = this.contacts.indexOf(originalContact)

  if (pos < 0) {
      return;
  }

  newContact.id = originalContact.id;
  
  this.contacts[pos] = newContact;

  const contactsListClone = this.contacts.slice();

  this.storeContact();
  // this.contactListChangedEvent.next(contactsListClone);
}

getMaxId(): number {
  let maxId = 0

  for (const contact of this.contacts){
      let currentId = parseFloat(contact.id);
  
      if (currentId > maxId){
          maxId = currentId
      }
  }        
  return maxId;
}
}
