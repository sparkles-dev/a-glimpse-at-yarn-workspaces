import { Component } from '@angular/core';
import { FOO } from '@foo/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = FOO.full;
}
