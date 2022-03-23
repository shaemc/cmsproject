import { Component, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { NgForm } from '@angular/forms';
import { DocumentService } from '../document.services';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;
  id: string;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params["id"];
         if (!this.id){
           this.editMode = false;
           return;
         }
         this.documentService.getDocument(this.id)
         .subscribe(documentData => {
           this.originalDocument = documentData.document;
           
           if (!this.originalDocument){
           return;
         }
         this.editMode = true;
          this.document = JSON.parse(JSON.stringify(this.originalDocument));
          // if(this.originalDocument.group && this.originalDocument.group.length > 0) {
          //   this.groupContacts = JSON.parse(
          //     JSON.stringify(this.originalContact.group)
          //   )
          // }
        
        });
    
         
           
    }) 
  }

  onCancel(){
    this.router.navigate(["/documents"]);
  }

  onSubmit(form: NgForm){
    const value = form.value;
    const newDocument = new Document(
      '',
      value.id,
      value.name,
      value.description,
      value.url,
      null
    );
    if (this.editMode) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else{
      this.documentService.addDocument(newDocument);
    }
    this.router.navigate(["/documents"])
  }

}
