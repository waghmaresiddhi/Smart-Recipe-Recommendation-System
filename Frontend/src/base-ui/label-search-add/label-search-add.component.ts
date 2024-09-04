import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-label-search-add',
  templateUrl: './label-search-add.component.html',
  styleUrls: ['./label-search-add.component.scss']
})
export class LabelSearchAddComponent implements OnInit {

  
  constructor() { }

  ngOnInit() {
  }

  @Input()
  label: string = 'List';

  @Input()
  searchPlaceholder: string = `Search ${this.label}`;

  @Input()
  buttonLabel: string = 'Add';

  @Input()
  myRouterLink: string = '';

  @Output()
  searchChange = new EventEmitter();

  @Output()
  addButtonClick = new EventEmitter();

  onSearchChange(search: string) {
    this.searchChange.emit(search);
  }

  onAddClick(click: any) {
    this.addButtonClick.emit(click);
  }

}
