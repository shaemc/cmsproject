import { Injectable } from "@angular/core";
import { Document } from "./document.model";
import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";
import { EventEmitter } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })

export class DocumentService{
    private documents: Document[] = [];
      
    documentSelectedEvent = new EventEmitter<Document>();
    documentChangedEvent = new EventEmitter<Document[]>();
    
    constructor() {
        this.documents = MOCKDOCUMENTS;
    }
    
    getDocuments() {
        return this.documents.slice();
    }
    
    getDocument(id: string): Document {
        return this.documents[id];     
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
        this.documentChangedEvent.emit(this.documents.slice());
     }
    }