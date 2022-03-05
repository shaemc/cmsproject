import { Injectable } from "@angular/core";
import { Document } from "./document.model";
import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";
import { Subscription } from 'rxjs';
import { Subject } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })

export class DocumentService{
    documents: Document[] = [];
    documentListChangedEvent = new Subject<Document[]>();
    maxDocumentId: number;
    subscription: Subscription;

    
    constructor(private http: HttpClient) {
        // this.documents = MOCKDOCUMENTS;
        this.maxDocumentId = this.getMaxId();
    }
    
    getDocuments() {
        return this.http
        .get(
            'https://wdd430-winter2022-7137c-default-rtdb.firebaseio.com/documents.json'
            )
        .subscribe(
        // success method
        (documents: Document[]) => {
           this.documents = documents;
           this.maxDocumentId = this.getMaxId();

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
    
    getDocument(id: string): Document {
        return this.documents.find((document) => document.id === id);     
        }

    deleteDocument(document: Document) {
        if (!document) {
           return;
        }
        const pos = this.documents.indexOf(document);
        if (pos < 0) {
           return;
        }
        this.documents.splice(pos, 1);
        this.documentListChangedEvent.next(this.documents.slice());

        this.storeDocument();
     }
    
    addDocument(newDocument: Document) {
        if (!newDocument) {
            return;
        }

        this.maxDocumentId++;

        newDocument.id = this.maxDocumentId.toString();

        this.documents.push(newDocument);
        
        const documentsListClone = this.documents.slice();

        this.storeDocument();
        // this.documentListChangedEvent.next(documentsListClone);
    }
    
    storeDocument() {
        let documents = JSON.stringify(this.documents);

        const headers = new HttpHeaders({'Content-Type': 'application/json'});

        this.http
        .put(
            'https://wdd430-winter2022-7137c-default-rtdb.firebaseio.com/documents.json',
            documents,
            {
                headers: headers,
            }
        )
        .subscribe(() => {
            this.documentListChangedEvent.next(this.documents.slice());
        });
    }

    updateDocument(originalDocument: Document, newDocument: Document){
        if (!originalDocument || !newDocument){
            return;
        }

        const pos = this.documents.indexOf(originalDocument)

        if (pos < 0) {
            return;
        }

        newDocument.id = originalDocument.id;
        
        this.documents[pos] = newDocument;

        const documentsListClone = this.documents.slice();

        this.storeDocument();
        // this.documentListChangedEvent.next(documentsListClone);
    }

    getMaxId(): number {
        let maxId = 0
    
        for (const document of this.documents){
            let currentId = parseFloat(document.id);
        
            if (currentId > maxId){
                maxId = currentId
            }
        }        
        return maxId;
    }
}