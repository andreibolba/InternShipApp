import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Day } from 'src/model/day.model';
import { LoggedPerson } from 'src/model/loggedperson.model';
import { Person } from 'src/model/person.model';
import { CalendarCreatorService } from 'src/services/calendar.creator.service';
import { DataStorageService } from 'src/services/data-storage.service';
import { UtilsService } from 'src/services/utils.service';

@Component({
  selector: 'app-intern-dashboard',
  templateUrl: './intern.dashboard.component.html',
  styleUrls: ['./intern.dashboard.component.css'],
})
export class InternDashboardComponent implements OnInit, OnDestroy {
  feedback = [
    {
      feedback: 'Very good job! Keep up with the good work!',
      date: ' 15-Feb-2023',
    },
    {
      feedback:
        'Very good job! Keep up with the good work!Very good job! Keep up with the good work!',
      date: ' 15-Feb-2023',
    },
    { feedback: 'Very good job!', date: ' 15-Feb-2023' },
  ];
  hasFeedback = true;
  feedbackLink = 'feedback';
  meetings = [
    {
      name: 'Semestrial Meeting with the team',
      date: ' 16-Feb-2023 5:00 PM',
      link: 'meetings',
    },
    {
      name: 'Meeting with the mentor',
      date: ' 17-Feb-2023 10:00 AM',
      link: 'meetings',
    },
    {
      name: 'Meeting with the client',
      date: ' 19-Feb-2023 1:15 PM',
      link: 'meetings',
    },
  ];
  hasMeetings = true;
  meetingsLink = 'meetings';
  monthDays!: Day[];
  monthNumber!: number;
  year!: number;
  weekDaysName: string[] = [];
  dataSub!: Subscription;
  person!: Person;
  isLoading=true;

  constructor(
    public calendarCreator: CalendarCreatorService,
    private utils: UtilsService,
    private dataService: DataStorageService,
    private router:Router
  ) {}

  ngOnDestroy(): void {
    if(this.dataSub) this.dataSub.unsubscribe();
  }

  ngOnInit(): void {
    this.utils.initializeError();
    if(this.router.url!='/dashboard')
    this.utils.dashboardChanged.next(false);

    this.isLoading=true;
    this.setMonthDays(this.calendarCreator.getCurrentMonth());

    this.weekDaysName.push('Mo');
    this.weekDaysName.push('Tu');
    this.weekDaysName.push('We');
    this.weekDaysName.push('Th');
    this.weekDaysName.push('Fr');
    this.weekDaysName.push('Sa');
    this.weekDaysName.push('Su');

    this.setCurrentUser();
  }

  private setMonthDays(days: Day[]): void {
    this.monthDays = days;
    this.monthNumber = this.monthDays[0].monthIndex;
    this.year = this.monthDays[0].year;
  }

  onLeaveDashboardClick() {
    this.utils.dashboardChanged.next(false);
  }

  setCurrentUser() {
    const personString = localStorage.getItem('person');
    if (!personString) {
      return;
    } else {
      const person: LoggedPerson = JSON.parse(personString);
      this.dataSub = this.dataService
        .getPerson(person.username, person.token)
        .subscribe(
          (res) => {
            this.person = res;
          },
          (error) => {
            console.log(error.error);
          },
          ()=>{
            this.isLoading=false;
          }
        );
    }
  }
}
