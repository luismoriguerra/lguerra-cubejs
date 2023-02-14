import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  cubeQuery = new BehaviorSubject(null);
  chartType = new BehaviorSubject(null);
  pivotConfig = new BehaviorSubject(null);

  ngOnInit() {
    this.cubeQuery.next({
      limit: 50,
      measures: ['Gitarchive.count_repository_name'],
      order: {
        'Gitarchive.count_repository_name': 'desc',
      },
      dimensions: ['Gitarchive.username'],
    });
    this.chartType.next('table');
    this.pivotConfig.next({
      x: ['Gitarchive.username'],
      y: ['measures'],
      fillMissingDates: true,
      joinDateRange: false,
      limit: 50,
    });
  }
}
