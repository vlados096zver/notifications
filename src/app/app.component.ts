import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent  {
  title = 'deep-links';

  constructor(private router: Router, private zone: NgZone) {
    this.initializeApp();
  }

  initializeApp() {
    console.log('Initializing app and adding listener for appUrlOpen');
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      console.log('Received appUrlOpen event:', event.url);
      this.zone.run(() => {
        const slug = event.url.split('com.example.app').pop();
        console.log('Navigating to:', slug);
        if (slug) {
          this.router.navigateByUrl(slug);
        }
      });
    });
  }

}
