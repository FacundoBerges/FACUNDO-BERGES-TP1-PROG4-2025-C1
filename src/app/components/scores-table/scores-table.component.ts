import {
  AfterViewInit,
  Component,
  input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';

import { Score, SCORE_COLUMNS } from '../../interfaces/score';

import { ScoresTableDataSource } from './scores-table-datasource';

@Component({
  selector: 'juegos-scores-table',
  templateUrl: './scores-table.component.html',
  styleUrl: './scores-table.component.scss',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule],
})
export class ScoresTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Score>;
  dataSource = new ScoresTableDataSource();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  columns = signal([...SCORE_COLUMNS]);
  displayedColumns: string[] = this.columns().map((c) => c.field);
  data = input.required<Score[]>();

  ngOnInit(): void {
    this.dataSource.data = this.data();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
