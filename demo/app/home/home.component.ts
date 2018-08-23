import { Component } from "@angular/core";

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    routes = [
        {name: 'Menu', route: '/menu-demo'},
        {name: 'Stepper', route: '/stepper-demo'},
        {name: 'Form Field', route: '/form-field-demo'},
        {name: 'Radio', route: '/radio-demo'},
        {name: 'Autocomplete', route: '/autocomplete-demo'},
        {name: 'Dialog', route: '/dialog-demo'}
    ];
}