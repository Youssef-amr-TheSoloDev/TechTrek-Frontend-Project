import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookData } from '../services/book-data';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements AfterViewInit {
  protected readonly title = signal('TechTrek-Frontend-Project');
  BookData = inject(BookData);

  ngAfterViewInit(): void {
    console.log(this.BookData.getBooks())
  }
}
