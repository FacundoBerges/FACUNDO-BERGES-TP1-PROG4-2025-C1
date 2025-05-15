import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

import { Score } from '../../interfaces/score';

// TODO: replace this with real data from your application
const EXAMPLE_DATA: Score[] = [];

/**
 * Data source for the ScoresTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ScoresTableDataSource extends DataSource<Score> {
  data: Score[] = EXAMPLE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Score[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(
        observableOf(this.data),
        this.paginator.page,
        this.sort.sortChange
      ).pipe(
        map(() => {
          return this.getPagedData(this.getSortedData([...this.data]));
        })
      );
    } else {
      throw Error(
        'Please set the paginator and sort on the data source before connecting.'
      );
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: Score[]): Score[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: Score[]): Score[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '')
      return data;

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';

      switch (this.sort?.active) {
        case 'id':
          if (a.id === undefined || b.id === undefined) return 0;
          return compare(a.id, b.id, isAsc);
        case 'created_at':
          if (a.created_at === undefined || b.created_at === undefined)
            return 0;
          return compare(
            a.created_at.toISOString(),
            b.created_at.toISOString(),
            isAsc
          );
        case 'user_id':
          return compare(a.user_id, b.user_id, isAsc);
        case 'game_id':
          return compare(a.game_id, b.game_id, isAsc);
        case 'correct':
          return compare(a.correct, b.correct, isAsc);
        case 'wrong':
          return compare(a.wrong, b.wrong, isAsc);
        case 'remaining_time_milis':
          return compare(a.remaining_time_milis, b.remaining_time_milis, isAsc);
        case 'total_score':
          return compare(a.total_score, b.total_score, isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(
  a: string | number,
  b: string | number,
  isAsc: boolean
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
