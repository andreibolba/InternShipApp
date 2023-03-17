import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LoggedPerson } from 'src/model/loggedperson.model';
import { Meeting } from 'src/model/meeting.model';
import { DataStorageService } from 'src/services/data-storage.service';
import { UtilsService } from 'src/services/utils.service';

@Component({
  selector: 'app-edit-meeting-dialog',
  templateUrl: './edit-meeting-dialog.component.html',
  styleUrls: ['./edit-meeting-dialog.component.css'],
})
export class EditMeetingDialogComponent implements OnInit, OnDestroy {
  editMode = true;
  isTrainer = true;
  operation = '';
  today = new Date().toISOString().slice(0, 10);
  meetingId: number = -1;
  trainerId: number = -1;
  trainerName: string = '';
  meetingName: string = '';
  meetingLink: string = '';

  personSub!: Subscription;
  meetingSub!: Subscription;
  modifyMeetingSub!: Subscription;

  private token: string = '';

  constructor(
    private utils: UtilsService,
    private dialogRef: MatDialogRef<EditMeetingDialogComponent>,
    private toastr: ToastrService,
    private dataService: DataStorageService
  ) {}

  ngOnDestroy(): void {
    if (this.personSub != null) this.personSub.unsubscribe();
  }

  ngOnInit(): void {
    this.utils.initializeError();
    const personString = localStorage.getItem('person');
    if (!personString) {
      return;
    } else {
      const person: LoggedPerson = JSON.parse(personString);
      this.token = person.token;
      this.personSub = this.dataService
        .getPerson(person.username, this.token)
        .subscribe((data) => {
          this.trainerId = data.personId;
          this.isTrainer = data.status == 'Trainer';
          this.trainerName = data.firstName + ' ' + data.lastName;
          this.meetingSub = this.utils.meetingToEdit.subscribe((data) => {
            if (data != null) {
              this.meetingName = data.meetingName;
              this.meetingLink = data.meetingLink;
              this.editMode = true;
              this.operation = 'Edit';
              this.meetingId = data.meetindId;
            } else {
              this.meetingName = '';
              this.meetingLink = '';
              this.editMode = true;
              this.operation = 'Add';
              this.meetingId = -1;
            }
          });
        });
    }
  }

  onSignUpSubmit(form: NgForm) {
    if (form.value.startTime >= form.value.finishTime) {
      this.toastr.warning('Start of the meeting must be before finish!');
    } else {
      let meet = new Meeting();
      meet.meetingName = form.value.meetingName;
      meet.meetingLink = form.value.meetingLink;
      var startOfMeet = new Date(form.value.dateOfMeet);
      startOfMeet.setHours(form.value.startTime.split(' ')[0].split(':')[0]);
      startOfMeet.setMinutes(form.value.startTime.split(' ')[0].split(':')[1]);
      meet.startTime = startOfMeet;
      var finishOfMeet = new Date(form.value.dateOfMeet);
      finishOfMeet.setHours(form.value.finishTime.split(' ')[0].split(':')[0]);
      finishOfMeet.setMinutes(
        form.value.finishTime.split(' ')[0].split(':')[1]
      );
      meet.finishTime = finishOfMeet;
      meet.traierId = this.trainerId;

      if (this.operation == 'Edit') {
        meet.meetindId = this.meetingId;
        this.modifyMeetingSub = this.dataService
          .updateMeeting(this.token, meet)
          .subscribe(
            () => {
              this.toastr.success('Meeting was edited succesfully!');
              this.dialogRef.close();
            },
            (error) => {
              this.toastr.error(error.error);
            }
          );
      } else {
        this.modifyMeetingSub = this.dataService
          .addMeeting(this.token, meet)
          .subscribe(
            () => {
              this.toastr.success('Meeting was added succesfully!');
              this.dialogRef.close();
            },
            (error) => {
              this.toastr.error(error.error);
            }
          );
      }
    }
  }
}