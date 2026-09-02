import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-explore-books',
  styleUrl: './explore-books.css',
  templateUrl: './explore-books.html',
})
export class ExploreBooks implements OnInit {
  searchTerm = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const term = params.get('term');
      this.searchTerm = term ? decodeURIComponent(term) : '';
    });
  }
}
