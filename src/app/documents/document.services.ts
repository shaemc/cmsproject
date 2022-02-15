import { Injectable } from "@angular/core";
import { Document } from "./document.model";
import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
  })

export class DocumentService{
    private documents: Document[] = [];
    documentListChangedEvent = new Subject<Document[]>();
    maxDocumentId: number;
    
    constructor() {
        this.documents = MOCKDOCUMENTS;
        this.maxDocumentId = this.getMaxId();
    }
    
    getDocuments() {
        return this.documents.slice();
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
     }
    
    addDocument(newDocument: Document) {
        if (!newDocument) {
            return;
        }

        this.maxDocumentId++;

        newDocument.id = this.maxDocumentId.toString();

        this.documents.push(newDocument);
        
        const documentsListClone = this.documents.slice();

        this.documentListChangedEvent.next(documentsListClone);
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

        this.documentListChangedEvent.next(documentsListClone);
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