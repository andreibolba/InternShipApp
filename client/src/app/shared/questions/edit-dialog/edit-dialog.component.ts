import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CreateEditDialogComponent } from 'src/app/admin/create-edit-dialog/create-edit-dialog.component';
import { LoggedPerson } from 'src/model/loggedperson.model';
import { Question } from 'src/model/question.model';
import { DataStorageService } from 'src/services/data-storage.service';
import { UtilsService } from 'src/services/utils.service';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css'],
})
export class EditDialogComponent implements OnInit, OnDestroy {
  @Input() questionData:{questionName:string,A:string|null,B:string|null,C:string|null,D:string|null,E:string|null,F:string|null,CorrectAnswer:string,Points:number} = {
    questionName: '',
    A: '',
    B: '',
    C: '',
    D: '',
    E: '',
    F: '',
    CorrectAnswer: '',
    Points: -1,
  };

  dataPeopleSub!: Subscription;
  addQuestion!: Subscription;
  editQuestion!: Subscription;
  getIdSub!: Subscription;
  utilsSub!: Subscription;
  operation: string = '';
  question!: Question | null;
  private correctAnswer = 'A';
  private token: string = '';
  private trainerId: number = -1;

  constructor(
    private dataService: DataStorageService,
    private utils: UtilsService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<EditDialogComponent>
  ) {}

  ngOnInit(): void {
    this.utils.initializeError();
    this.utilsSub = this.utils.questionToEdit.subscribe((res) => {
      this.question = res;
      console.log(this.question);
      this.correctAnswer=res!.correctOption;
      this.questionData = {
        questionName: res!.questionName,
        A: res!.a,
        B: res!.b,
        C: res!.c,
        D: res!.d,
        E: res!.e,
        F: res!.f,
        CorrectAnswer: res!.correctOption,
        Points: res!.points,
      };
    });

    if (this.question == null) {
      this.operation = 'Add';
    } else {
      this.operation = 'Edit';
    }
    const personString = localStorage.getItem('person');
    if (!personString) {
      return;
    } else {
      const person: LoggedPerson = JSON.parse(personString);
      this.token = person.token;
      this.getIdSub = this.dataService.personData
        .getPerson(person.username, this.token)
        .subscribe((data) => {
          this.trainerId = data.personId;
        });
    }
  }

  ngOnDestroy(): void {
    this.utils.userToEdit.next(null);
    if (this.dataPeopleSub) this.dataPeopleSub.unsubscribe();
    if (this.utilsSub) this.utilsSub.unsubscribe();
    if (this.getIdSub) this.getIdSub.unsubscribe();
    if (this.addQuestion) this.addQuestion.unsubscribe();
    if (this.editQuestion) this.editQuestion.unsubscribe();
  }

  changeCorrectAnswer(e: string) {
    this.correctAnswer = e;
  }

  verifyEmptySpaces(question: Question): boolean {
    if (
      question.c == '' &&
      (question.d != '' || question.e != '' || question.f != '')
    )
      return false;
    if (question.d == '' && (question.e != '' || question.f != ''))
      return false;
    if (question.e == '' && question.f != '') return false;
    return true;
  }

  veriryCorrectAnswer(question: Question): boolean {
    if (question.correctOption == 'A' && question.a == '') return false;
    if (question.correctOption == 'B' && question.b == '') return false;
    if (question.correctOption == 'C' && question.c == '') return false;
    if (question.correctOption == 'D' && question.d == '') return false;
    if (question.correctOption == 'E' && question.e == '') return false;
    if (question.correctOption == 'F' && question.f == '') return false;
    return true;
  }

  onSignUpSubmit(form: NgForm) {
    let question = new Question();
    question.questionName = form.value.qName;
    question.a = form.value.a;
    question.b = form.value.b;
    question.c = form.value.c;
    question.d = form.value.d;
    question.e = form.value.e;
    question.f = form.value.f;
    question.points = form.value.points;
    question.correctOption = this.correctAnswer;

    if (this.verifyEmptySpaces(question) == false) {
      this.toastr.error(
        'Answers must be one followed be other with no blank spaces!'
      );
    } else {
      if (this.veriryCorrectAnswer(question) == false) {
        this.toastr.error('Correct answer must be filled!');
      } else {
        question.c = question.c == '' ? null : question.c;
        question.d = question.d == '' ? null : question.d;
        question.e = question.e == '' ? null : question.e;
        question.f = question.f == '' ? null : question.f;
        question.trainerId = this.trainerId;
        if(this.operation=='Add'){
        this.addQuestion = this.dataService.quizData.questionData
          .addQuestion(this.token, question)
          .subscribe(
            (res) => {
              this.dataService.quizData.questionData.questionAdded.next(res);
              this.toastr.success('Question was added with success!');
              this.dialogRef.close();
            },
            (error) => {
              this.toastr.error(error.error);
            }
          );
        }else{
          question.questionId=this.question!.questionId;
          this.addQuestion = this.dataService.quizData.questionData
          .editQuestion(this.token, question)
          .subscribe(
            (res) => {
              this.dataService.quizData.questionData.questionAdded.next(res);
              this.toastr.success('Question was edited with success!');
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
}
