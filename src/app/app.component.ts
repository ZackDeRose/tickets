import { routerTransition } from './router-animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [ routerTransition ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  getState(outlet) {
    return outlet.activatedRouteData.state;
  }
}
