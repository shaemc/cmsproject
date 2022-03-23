import { Injectable } from "@angular/core";
import { Document } from "./document.model";
import { Subscription } from 'rxjs';
import { Subject } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })

export class DocumentService{
    private documents: Document[] = [];
    documentListChangedEvent = new Subject<Document[]>();
    // maxDocumentId: number;
    subscription: Subscription;

    
    constructor(private http: HttpClient) {
        // this.documents = MOCKDOCUMENTS;
        // this.maxDocumentId = this.getMaxId();
    }
    
    sortAndSend() {
        this.documents.sort((a, b) =>
           a.name > b.name ? 1 : b.name > a.name ? -1 : 0
           );
    
           this.documentListChangedEvent.next(this.documents.slice());
      }

    getDocuments() {
        return this.http
        .get<{ message: string, documents: Document[]}>(
            'http://localhost:3000/documents'
            )
        .subscribe(
        // success method
        (responseData) => {
           this.documents = responseData.documents;
        //    this.maxDocumentId = this.getMaxId();

           this.documents.sort((a, b) =>
           a.name > b.name ? 1 : b.name > a.name ? -1 : 0
           );

           this.documentListChangedEvent.next(this.documents.slice());
        },
        // error method
        (error: any) => {
           console.log(error)
        }
        );
    }
    
    getDocument(id: string) {
        // return this.documents.find((document) => document.id === id);     
    return this.http.get<{ message: string, document: Document }>('http://localhost:3000/documents/' + id);     
        
    }

    
deleteDocument(document: Document) {

    if (!document) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === document.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete('http://localhost:3000/documents/' + document.id)
      .subscribe(
        (response: Response) => {
          this.documents.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }
    
    
addDocument(document: Document) {
    if (!document) {
      return;
    }

    // make sure id of the new Document is empty
    document.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
      document,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.documents.push(responseData.document);
          this.sortAndSend();
        }
      );
  }
    
    // storeDocument() {
    //     let documents = JSON.stringify(this.documents);

    //     const headers = new HttpHeaders({'Content-Type': 'application/json'});

    //     this.http
    //     .put(
    //         'localhost:27017/cms/documents',
    //         documents,
    //         {
    //             headers: headers,
    //         }
    //     )
    //     .subscribe(() => {
    //         this.documentListChangedEvent.next(this.documents.slice());
    //     });
    // }

    updateDocument(originalDocument: Document, newDocument: Document) {
        if (!originalDocument || !newDocument) {
          return;
        }
    
        const pos = this.documents.findIndex(d => d.id === originalDocument.id);
    
        if (pos < 0) {
          return;
        }
    
        // set the id of the new Document to the id of the old Document
        newDocument.id = originalDocument.id;
        newDocument._id = originalDocument._id;
    
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
    
        // update database
        this.http.put('http://localhost:3000/documents/' + originalDocument.id,
          newDocument, { headers: headers })
          .subscribe(
            (response: Response) => {
              this.documents[pos] = newDocument;
              this.sortAndSend();
            }
          );
      }

    // getMaxId(): number {
    //     let maxId = 0
    
    //     for (const document of this.documents){
    //         let currentId = parseFloat(document.id);
        
    //         if (currentId > maxId){
    //             maxId = currentId
    //         }
    //     }        
    //     return maxId;
    // }
}