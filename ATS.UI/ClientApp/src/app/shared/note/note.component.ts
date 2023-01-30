import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CommonUtils } from '../../common/common-utils';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
    commonUtils = new CommonUtils();
    @ViewChild('dt', { static: false }) dt: any;
    @Input() title = 'Notes History';
    //@Input() subTitle = 'These notes will not be sent to your supplier';
    @Input() data: any[] = [];

  constructor() { }

    ngOnInit(): void {
  }

}
