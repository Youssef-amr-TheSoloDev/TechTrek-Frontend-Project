import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Book } from '../../../types/types.type';
import { BookData } from '../../../services/book-data';
import { Icon } from '../../components/icon/icon';
import { HomeBookCard } from '../../components/home-book-card/home-book-card';
import { HomeNewsletter } from '../../components/home-newsletter/home-newsletter';

@Component({
  imports: [HomeBookCard, HomeNewsletter, Icon, RouterLink],
  selector: 'app-book-details',
  styleUrl: './book-details.css',
  templateUrl: './book-details.html',
})
export class BookDetails implements OnInit, OnDestroy {
  activeTab: 'description' | 'details' | 'reviews' = 'description';
  book?: Book;
  relatedBooks: Book[] = [];
  isLoading = true;
  private routeSubscription?: Subscription;

  constructor(private readonly route: ActivatedRoute, private readonly bookData: BookData) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const id = params.get('bookname');
      this.book = undefined;
      this.relatedBooks = [];
      this.isLoading = true;

      if (!id) {
        this.isLoading = false;
        return;
      }

      this.bookData.getBookById(id).subscribe({
        next: (book) => {
          this.book = book;
          this.isLoading = false;

          if (book) {
            this.bookData.getPopularBooks().subscribe((response) => {
              const popularBooks = (response.items ?? []).filter((relatedBook) => relatedBook.id !== id);
              this.relatedBooks = (popularBooks.length ? popularBooks : (this.bookData.getBooks() ?? []).filter((relatedBook) => relatedBook.id !== id)).slice(0, 5);
            });
          }
        },
        error: () => {
          this.book = undefined;
          this.isLoading = false;
        },
      });
    });
  }

  get title(): string { return this.book?.volumeInfo.title || ''; }
  get authors(): string { return this.book?.volumeInfo.authors?.join(', ') || 'Unknown author'; }
  get coverImage(): string { return (this.book?.volumeInfo.imageLinks?.large || this.book?.volumeInfo.imageLinks?.thumbnail || '').replace('http://', 'https://'); }
  get description(): string { return (this.book?.volumeInfo.description || 'No description is available for this title.').replace(/<[^>]*>/g, ''); }
  get categories(): string[] { return this.book?.volumeInfo.categories ?? []; }
  get publisher(): string { return this.book?.volumeInfo.publisher || 'Publisher unavailable'; }
  get publishedDate(): string { return this.book?.volumeInfo.publishedDate || 'Date unavailable'; }
  get pageCount(): string { return this.book?.volumeInfo.pageCount ? `${this.book.volumeInfo.pageCount}` : 'N/A'; }
  get price(): string {
    const price = this.book?.saleInfo?.retailPrice || this.book?.saleInfo?.listPrice;
    return price ? `${price.currencyCode} ${price.amount.toFixed(2)}` : 'Price unavailable';
  }

  selectTab(tab: 'description' | 'details' | 'reviews'): void {
    this.activeTab = tab;
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }
}
