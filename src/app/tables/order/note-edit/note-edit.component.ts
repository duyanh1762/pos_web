import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

interface CartItem {
  id: number;
  itemID: number;
  num: number;
  billID: number;
  policyID: number;
  name: string;
  note:string
  price: number;
}

@Component({
  selector: 'app-note-edit',
  templateUrl: './note-edit.component.html',
  styleUrls: ['./note-edit.component.css']
})
export class NoteEditComponent implements OnInit {
  @Input() data:CartItem;
  @Output() noteEvent = new EventEmitter();

  note:string="";

  constructor(private bsRef:BsModalRef) { }

  ngOnInit(): void {
    this.load();
  }

  load(){
    this.note = this.data.note;
  }

  onSubmit(){
    this.noteEvent.emit(this.note);
    this.bsRef.hide();
  }
}
