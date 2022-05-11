import { Component, OnInit } from '@angular/core'
import { showErrorPopup } from '../../../../shared/pop-up/pop_up.utils'
import Swal from 'sweetalert2'
import { AccountService } from '../../../user-account/services/account.service'
import Story from '../../model/story.model'
import * as moment from 'moment'
import { StoryService } from '../../services/story.service'

@Component({
  selector: 'skl-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css'],
})
export class StoriesComponent implements OnInit {

  users: Array<string>;
  dataStories: any = {};
  userStories: any[] = [];
  displayModal: boolean;
  displayModalAddStory: boolean;
  userLogged = { name: '', email: '' };

  reference: string;
  referenceType: string;
  description: string;

  constructor(
    private storyService: StoryService,
    private accountService: AccountService
  ) {
  }

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
    if (!this.isValidStoryData()) {
      return;
    }
    this.storyService.sendStory(story).subscribe(
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
        showErrorPopup('Ocurrió un error inesperado, intenta más tarde');
      }
    );
  }

  getUserStories() {
    this.storyService.getUserStories().subscribe(
      (response: any) => {
        this.userStories = response;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getFriendsStories() {
    this.storyService.getFriendsStories().subscribe(
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
    this.accountService.getUserAccountData()
      .subscribe(({ data }) => {
        this.userLogged = data.user;
      });
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
        this.storyService.deleteStory(temporal_post_id).subscribe(
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
  }

  public isValidStoryData() {
    return this.reference && this.referenceType;
  }
}
