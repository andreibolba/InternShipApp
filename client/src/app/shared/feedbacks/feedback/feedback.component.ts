import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LoggedPerson } from 'src/model/loggedperson.model';
import { Note } from 'src/model/note.model';
import { DataStorageService } from 'src/services/data-storage.service';
import { UtilsService } from 'src/services/utils.service';
import { AddEditNoteComponent } from '../../notes/add-edit-note/add-edit-note.component';
import { AddEditFeedbackComponent } from '../add-edit-feedback/add-edit-feedback.component';
import { Feedback } from 'src/model/feedback.model';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit, OnDestroy {
  feedbackSubscription!: Subscription;
  personSubscription!: Subscription;
  deletefeedbackSubscription!: Subscription;
  feedbacks:Feedback[]=[];
  private token: string = '';
  username: string='';

  constructor(
    private utils: UtilsService, 
    private dataStorage: DataStorageService, 
    private dialog: MatDialog,
    private toastr: ToastrService
    ) {
  }

  ngOnInit(): void {
    this.utils.initializeError();
    const personString = localStorage.getItem('person');
    if (!personString) {
      return;
    } else {
      const person: LoggedPerson = JSON.parse(personString);
      this.token = person.token;
      this.username = person.username;
      this.personSubscription = this.dataStorage.getPerson(this.username, this.token).subscribe((data)=>{
        this.feedbackSubscription = this.dataStorage.getAllFeedbacksForSpecificForPerson(this.token,data.personId,data.status.toLocaleLowerCase()).subscribe((res)=>{
          this.feedbacks=res;
        });
      });
    }
  }

  ngOnDestroy(): void {
    if (this.deletefeedbackSubscription != null) this.deletefeedbackSubscription.unsubscribe();
    if (this.feedbackSubscription != null) this.feedbackSubscription.unsubscribe();
    if (this.personSubscription != null) this.personSubscription.unsubscribe();
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddEditFeedbackComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onAdd() {
    this.utils.feedbackToEdit.next(null);
    this.openDialog();
  }

  onEdit(feedback: Feedback) {
    this.utils.feedbackToEdit.next(feedback);
    this.openDialog();
  }

  onDelete(feedback: Feedback) {
    this.deletefeedbackSubscription = this.dataStorage.deleteFeedback(this.token, feedback.feedbackId).subscribe(() => {
      this.toastr.success("Feedback was deleted succesfully!");
      let index = this.feedbacks.findIndex(c=>c.feedbackId == feedback.feedbackId);
      if(index!=-1)
        this.feedbacks.splice(index,1);
    }, (error) => {
      this.toastr.error(error.error);
    });
  }
}
