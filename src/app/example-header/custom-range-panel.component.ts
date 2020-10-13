import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatDateRangePicker } from '@angular/material/datepicker';

const customPresets = [
  'today',
  'last 7 days',
  'this week',
  'this month',
  'this year',
  'last week',
  'last month',
  'last year',
] as const;

@Component({
  selector: 'app-custom-range-panel',
  templateUrl: './custom-range-panel.component.html',
  styleUrls: ['./custom-range-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomRangePanelComponent<D> {
  readonly customPresets = customPresets;

  constructor(
    private dateAdapter: DateAdapter<D>,
    private picker: MatDateRangePicker<D>
  ) {}

  selectRange(rangeName: typeof customPresets[number]): void {
    const [start, end] = this.calculateDateRange(rangeName);
    this.picker.select(start);
    this.picker.select(end);
    this.picker.close();
  }

  private calculateDateRange(
    rangeName: typeof customPresets[number]
  ): [start: D, end: D] {
    const today = this.today;
    const year = this.dateAdapter.getYear(today);

    switch (rangeName) {
      case 'today':
        return [today, today];
      case 'last 7 days': {
        const start = this.dateAdapter.addCalendarDays(today, -6);
        return [start, today];
      }
      case 'this week': {
        return this.calculateWeek(today);
      }
      case 'this month': {
        return this.calculateMonth(today);
      }
      case 'this year': {
        const start = this.dateAdapter.createDate(year, 0, 1);
        const end = this.dateAdapter.createDate(year, 11, 31);
        return [start, end];
      }
      case 'last week': {
        const thisDayLastWeek = this.dateAdapter.addCalendarDays(today, -7);
        return this.calculateWeek(thisDayLastWeek);
      }
      case 'last month': {
        const thisDayLastMonth = this.dateAdapter.addCalendarMonths(today, -1);
        return this.calculateMonth(thisDayLastMonth);
      }
      case 'last year': {
        const start = this.dateAdapter.createDate(year - 1, 0, 1);
        const end = this.dateAdapter.createDate(year - 1, 11, 31);
        return [start, end];
      }
    }

    ((param: never) => {})(rangeName); // exhaustiveness check
  }

  private calculateMonth(forDay: D): [start: D, end: D] {
    const year = this.dateAdapter.getYear(forDay);
    const month = this.dateAdapter.getMonth(forDay);
    const start = this.dateAdapter.createDate(year, month, 1);
    const end = this.dateAdapter.addCalendarDays(
      start,
      this.dateAdapter.getNumDaysInMonth(forDay) - 1
    );
    return [start, end];
  }

  private calculateWeek(forDay: D): [start: D, end: D] {
    const deltaStart =
      this.dateAdapter.getFirstDayOfWeek() -
      this.dateAdapter.getDayOfWeek(forDay);
    const start = this.dateAdapter.addCalendarDays(forDay, deltaStart);
    const end = this.dateAdapter.addCalendarDays(start, 6);
    return [start, end];
  }

  private get today(): D {
    const today = this.dateAdapter.getValidDateOrNull(new Date());
    if (today === null) {
      throw new Error('date creation failed');
    }
    return today;
  }
}