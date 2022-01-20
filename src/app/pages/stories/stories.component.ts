import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import Story from 'src/app/models/story.model';
import { AccountService } from 'src/app/services/account.service';
import { StoriesService } from 'src/app/services/stories.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css'],
})
export class StoriesComponent implements OnInit {
  users: Array<string>;
  dataStories: any = {};
  userStories: any[] = [];
  displayModal: boolean;
  displayModalAddStory: boolean;
  userLogged: any;

  reference: string;
  referenceType: string;
  description: string;

  // friendsStories = Object.values(this.dataStories);

  constructor(
    private storiesService: StoriesService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.getLoggedUserInfo();
    this.getUserStories();
    this.getFriendsStories();
  }

  sendStory() {
    const story: Story = {
      description: this.description,
      reference: this.reference,
      referenceType: this.referenceType,
    };
    this.storiesService.sendStory(story).subscribe(
      () => {
        Swal.fire({
          customClass: {
            container: 'my-swal',
          },
          title: 'Exito',
          text: 'La historia ha sido creada correctamente',
          icon: 'success',
          confirmButtonColor: '#00887A',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      },
      () => {
        Swal.fire(
          'Error',
          'Ocurrió un error inesperado, intenta más tarde',
          'error'
        );
      }
    );
  }

  getUserStories() {
    this.storiesService.getUserStories().subscribe(
      (response: any) => {
        this.userStories = response;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getFriendsStories() {
    this.storiesService.getFriendsStories().subscribe(
      (response: any) => {
        this.users = Object.keys(response);
        this.dataStories = { ...response };
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getLoggedUserInfo() {
    this.accountService.getUserAccountData().subscribe((response) => {
      this.userLogged = response;
    });
  }

  getStoryUserName(user: string) {
    return this.dataStories[user][0].name;
  }

  getStoryUserEmail(user: string) {
    return this.dataStories[user][0].email;
  }

  getFormattedDate(date: string) {
    moment.locale('es');
    return moment(date).format('LLL');
  }

  showModalDialog() {
    this.displayModal = true;
  }
  showModalDialogAddStory() {
    this.displayModalAddStory = true;
  }

  deleteStory(temporal_post_id: string) {
    Swal.fire({
      customClass: {
        container: 'my-swal',
      },
      title: '¿Está seguro de eliminar la historia?',
      text: 'Una vez eliminada no podrás recuperarla',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00887A',
      cancelButtonColor: '#fc6662',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar', 
    }).then((result) => {
      if (result.isConfirmed) {
        this.storiesService.deleteStory(temporal_post_id).subscribe(
          () => {
            Swal.fire({
              customClass: {
                container: 'my-swal',
              },
              title: 'Exito',
              text: 'La historia ha sido eliminada correctamente',
              icon: 'success',
              confirmButtonColor: '#00887A',
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            });
          },
          (err: any) => {
            console.log(err);
          }
        );
      }
    });

    // this.displayModal = false;
  }
}
