import { Component } from "@angular/core";

@Component({
    templateUrl: './autocomplete-demo.component.html',
    styleUrls: ['./autocomplete-demo.component.scss']
})
export class AutocompleteDemoComponent {
    multiple = true;
    value?: any = ['valAlaska', 'valUtah'];
    selected?: string;
}