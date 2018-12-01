import { startWith, switchMap, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Ticket } from './../data-layer/models/ticket.model';
import { Observable } from 'rxjs';
import { BackendService } from './../backend.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '../../../node_modules/@angular/forms';

@Component({
  selector: 'app-new-table',
  templateUrl: './new-table.component.html',
  styleUrls: ['./new-table.component.css']
})
export class NewTableComponent implements OnInit {
  filter = new FormControl();
  completedOnly = new FormControl(true);
  group = new FormGroup({
    filter: this.filter,
    completedOnly: this.completedOnly
  });
  tableDataSource$: Observable<Ticket[]>;

  constructor(private backendService: BackendService) { }

  ngOnInit() {
    this.tableDataSource$ = this.group.valueChanges.pipe(
      startWith({ filter: '', completedOnly: this.completedOnly.value }),
      debounceTime(300),
      distinctUntilChanged(),
      tap(console.log),
      switchMap(filterData => this.backendService.ticketsBy(filterData.filter, filterData.completedOnly).pipe(
        tap(console.log)
      ))
    );
  }

}
