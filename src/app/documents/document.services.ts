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
    
    constructor() {
        this.documents = MOCKDOCUMENTS;
    }
    
    getDocuments() {
        return this.documents.slice();
    }
    
    getDocument(id: string): Document {
        return this.documents.find((document) => document.id === id);     
        }
    }
