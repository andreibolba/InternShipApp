import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LoggedPerson } from 'src/model/loggedperson.model';
import { Meeting } from 'src/model/meeting.model';
import { DataStorageService } from 'src/services/data-storage.service';
import { UtilsService } from 'src/services/utils.service';

export class CheckBox {
  id: number;
  name: string;
  checked: boolean;

  constructor(id: number, name: string, checked: boolean) {
    this.name = name;
    this.id = id;
    this.checked = checked;
  }
}

@Component({
  selector: 'app-edit-meeting-dialog',
  templateUrl: './edit-meeting-dialog.component.html',
  styleUrls: ['./edit-meeting-dialog.component.css'],
})
export class EditMeetingDialogComponent implements OnInit, OnDestroy {
  editMode = true;
  isTrainer = true;
  operation = '';
  date = new Date().toISOString().slice(0, 10);
  startTimeOfMeetingBind: any;
  finishTimeOfMeetingBind: any;
  meetingId: number = -1;
  trainerId: number = -1;
  trainerName: string = '';
  meetingName: string = '';
  meetingLink: string = '';

  personSub!: Subscription;
  meetingSub!: Subscription;
  modifyMeetingSub!: Subscription;
  optionsInternsSub!: Subscription;
  optionsGroupSub!: Subscription;

  optionsInterns: CheckBox[] = [];
  optionsGroups: CheckBox[] = [];

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
      this.personSub = this.dataService.personData
        .getPerson(person.username, this.token)
        .subscribe((data) => {
          this.trainerId = data.personId;
          this.isTrainer = data.status == 'Trainer';
          this.trainerName = data.firstName + ' ' + data.lastName;
          this.meetingSub = this.utils.meetingToEdit.subscribe((data) => {
            if (data != null) {
              this.startTimeOfMeetingBind = new Date(
                new Date(new Date(data.meetingStartTime) + ' UTC')
              )
                .toISOString()
                .slice(11, 16);
              this.finishTimeOfMeetingBind = new Date(
                new Date(new Date(data.meetingFinishTime) + ' UTC')
              )
                .toISOString()
                .slice(11, 16);
              this.date = new Date(
                new Date(new Date(data.meetingStartTime) + ' UTC')
              )
                .toISOString()
                .slice(0, 10);
              this.meetingName = data.meetingName;
              this.meetingLink = data.meetingLink;
              this.editMode = true;
              this.operation = 'Edit';
              this.meetingId = data.meetingId;
            } else {
              this.meetingName = '';
              this.meetingLink = '';
              this.editMode = true;
              this.operation = 'Add';
              this.meetingId = -1;
            }

            this.optionsInternsSub = this.dataService.meetingData
              .getAllInternsInMeeting(this.token, this.meetingId)
              .subscribe((res) => {
                res.forEach((element) => {
                  this.optionsInterns.unshift(
                    new CheckBox(
                      element.internId,
                      element.firstName + ' ' + element.lastName,
                      element.isChecked
                    )
                  );
                });
              });

              this.optionsGroupSub = this.dataService.meetingData
              .getAllGroupsInMeeting(this.token, this.meetingId,this.trainerId)
              .subscribe((res) => {
                res.forEach((element) => {
                  this.optionsGroups.unshift(
                    new CheckBox(
                      element.groupId,
                      element.groupName,
                      element.isChecked
                    )
                  );
                });
              });
          });
        });
    }
  }

  onSignUpSubmit(form: NgForm) {
    if (form.value.startTime >= form.value.finishTime) {
      this.toastr.warning('Start of the meeting must be before finish!');
      return;
    }
    if (new Date(form.value.dateOfMeet) < new Date()) {
      this.toastr.warning('Date of meeting must be at least today!');
      return;
    }

    let meet = new Meeting();
    meet.meetingName = form.value.meetingName;
    meet.meetingLink = form.value.meetingLink;

    var startOfMeet = new Date(form.value.dateOfMeet);
    startOfMeet.setHours(form.value.startTime.split(' ')[0].split(':')[0]);
    startOfMeet.setMinutes(form.value.startTime.split(' ')[0].split(':')[1]);
    meet.meetingStartTime = new Date(startOfMeet + ' UTC');

    var finishOfMeet = new Date(form.value.dateOfMeet);
    finishOfMeet.setHours(form.value.finishTime.split(' ')[0].split(':')[0]);
    finishOfMeet.setMinutes(form.value.finishTime.split(' ')[0].split(':')[1]);
    meet.meetingFinishTime = new Date(finishOfMeet + ' UTC');

    meet.traierId = this.trainerId;

    var selected = this.optionsInterns.filter((op) => op.checked == true);
    var internIds: string = '';
    selected.forEach((element) => {
      internIds += element.id.toString() + '_';
    });

    selected = this.optionsGroups.filter((op) => op.checked == true);
    var groupIds: string = '';
    selected.forEach((element) => {
      groupIds += element.id.toString() + '_';
    });

    meet.internIds=internIds;
    meet.groupIds=groupIds;

    if (this.operation == 'Edit') {
      console.log(meet);
      meet.meetingId = this.meetingId;
      this.modifyMeetingSub = this.dataService.meetingData
        .updateMeeting(this.token, meet)
        .subscribe(
          (res) => {
            this.dataService.meetingData.meetignAdded.next(res);
            this.toastr.success('Meeting was edited succesfully!');
            this.dialogRef.close();
          },
          (error) => {
            this.toastr.error(error.error);
            console.log(error.error);
          }
        );
    } else {
      console.log(meet);
      this.modifyMeetingSub = this.dataService.meetingData
        .addMeeting(this.token, meet)
        .subscribe(
          (res) => {
            this.dataService.meetingData.meetignAdded.next(res);
            this.toastr.success('Meeting was added succesfully!');
            this.dialogRef.close();
          },
          (error) => {
            this.toastr.error(error.error);
          }
        );
    }
  }

  valueChangeIntern(op: CheckBox) {
    op.checked = !op.checked;
  }

  valueChangeGroup(op: CheckBox) {
    op.checked = !op.checked;
  }
}
