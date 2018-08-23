import { Component } from "@angular/core";
import {VxNsDialog} from '../../../lib/src/dialog/vx-ns-dialog.service';

@Component({
    templateUrl: './dialog-demo.component.html',
    styleUrls: ['./dialog-demo.component.scss']
})
export class DialogDemoComponent {
    constructor(private dialog: VxNsDialog) {

    }

    showDialog(): void {
        // const dialog = this.dialog.open({
        //     title: 'Your title',
        //     message: 'Your Message',
        //     buttons: ['Dismiss']
        // });
        // dialog.onClose.subscribe(() => {
        //     console.log('CLOSED!!')
        // });


        // this.dialog.showLoadingIndicator('Loading...!');
        // setTimeout(() => {
        //     this.dialog.closeLoadingIndicator();

        const str = 'An unknown problem occurred trying to start poo. play. Please try again lageter!';
        // this.dialog.showLoadingIndicator(str);
            this.dialog.open({
                title: 'Error',
                message: str,
                buttons: ['Dismiss']
            })
        // }, 4000)

        // const dialog2 = this.dialog.open({
        //     title: 'Your title Number 2',
        //     message: 'Your Messag Numer 2 e',
        //     buttons: ['Dismiss']
        // });
        // dialog2.onClose.subscribe(() => {
        //    console.log('Dialog 2 closed!')
        // });
        //
        //
        // setTimeout(() => {
        //     this.dialog.open({
        //         title: 'Your title Number 3',
        //         message: 'Your Messag Numer 2 e',
        //         buttons: ['Dismiss']
        //     }).onClose.subscribe(() => {
        //         console.log('Dialog 3 closed')
        //     });
        // }, 100);
        // dialog.close();



    }
}