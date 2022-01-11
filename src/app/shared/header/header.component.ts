import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage.service';
import { AlertDialogComponent } from 'src/app/dialogs/alert-dialog/alert-dialog.component';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSideBarEvent: EventEmitter<any> = new EventEmitter();



  constructor(
    private router: Router,
    private dialog: MatDialog,
    private storageService: StorageService,
  ) { }

  ngOnInit(): void {
  }

  toggleSideBar(){
    this.toggleSideBarEvent.emit();
  }

  onClickSettings(){
    this.router.navigate(['home/settings']);
  }

  refreshPage() {
    window.location.reload();
  }

  openLogoutAlertDialog() {

      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;

      let dialog = this.dialog.open(AlertDialogComponent, {
        data : {
          title: 'Sign Out?',
          subtitle: 'Do you really want to sign out.',
          showDangerBtn: true,
          showPrimaryBtn: true,
          dangerBtnName: 'Cancel',
          primaryBtnName: 'Sign out'
        }
      });

      // const dialogRef = this.dialog.open(AlertDialogComponent);

      dialog.afterClosed().subscribe(
          data => {
            if(data){
              this.storageService.clear();
              this.router.navigate(['']);
            }
          }
      );


  }



}
