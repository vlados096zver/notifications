import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss']
})
export class DetailsPage implements OnInit {
  id: string | null = null;
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
        this.id = params.get('id');
        if (this.id) {
          console.log('Details ID:', this.id);
        } else {
          console.error('ID is null or undefined');
        }
      },
      error => {
        console.error('Error retrieving params:', error);
      }
    );
  }

}
