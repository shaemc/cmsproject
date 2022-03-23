import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { Subject } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class ContactService {
  private contacts: Contact[] = [];
  contactListChangedEvent = new Subject<Contact[]>();
  // maxContactId: number;

  constructor(private http: HttpClient) {
    // this.contacts = MOCKCONTACTS;
    // this.maxContactId = this.getMaxId();

  }

  sortAndSend() {
    this.contacts.sort((a, b) =>
       a.name > b.name ? 1 : b.name > a.name ? -1 : 0
       );

       this.contactListChangedEvent.next(this.contacts.slice());
  }

  getContacts() {
    return this.http
    .get<{ message: string, contacts: Contact[]}>(
        'http://localhost:3000/contacts'
        )
    .subscribe(
    // success method
    (responseData) => {
       this.contacts = responseData.contacts;
      //  this.maxContactId = this.getMaxId();

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

  getContact(id: string) {
    return this.http.get<{ message: string, contact: Contact }>('http://localhost:3000/contacts/' + id);     
    }

  deleteContact(contact: Contact) {
    if (!contact) {
       return;
    }
    const pos = this.contacts.findIndex(c => c.id === contact.id);
    if (pos < 0) {
       return;
    }
    this.http.delete('http://localhost:3000/contacts/' + contact.id)
    .subscribe(
      (response: Response) => {
        this.contacts.splice(pos, 1);
        this.sortAndSend();
      }
    );

    // this.contacts.splice(pos, 1);

    // this.contactListChangedEvent.next(this.contacts.slice());
    // this.storeContact();
 }

 addContact(contact: Contact) {
  if (!contact) {
      return;
  }

  contact.id = '';

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts',
      contact,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.contacts.push(responseData.contact);
          this.sortAndSend();
        }
      );
}

// storeContact() {
//   let contacts = JSON.stringify(this.contacts);

//   const headers = new HttpHeaders({'Content-Type': 'application/json'});

//   this.http
//   .put(
//       'localhost:27017/cms/contacts',
//       contacts,
//       {
//           headers: headers,
//       }
//   )
//   .subscribe(() => {
//       this.contactListChangedEvent.next(this.contacts.slice());
//   });
// }

updateContact(originalContact: Contact, newContact: Contact){
  if (!originalContact || !newContact){
      return;
  }

  const pos = this.contacts.findIndex(c => c.id === originalContact.id)

  if (pos < 0) {
      return;
  }

  newContact.id = originalContact.id;
  newContact._id = originalContact._id;

  const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
  this.http.put('http://localhost:3000/contacts/' + originalContact.id,
    newContact, { headers: headers })
    .subscribe(
      (response: Response) => {
        this.contacts[pos] = newContact;
        this.sortAndSend();
      }
    );

  // this.storeContact();
  // this.contactListChangedEvent.next(contactsListClone);
}

}
