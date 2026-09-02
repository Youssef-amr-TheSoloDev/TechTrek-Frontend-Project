import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BooksResponse } from '../types/types.type';

@Injectable({
  providedIn: 'root'
})
export class BookData {

  private readonly cacheKey = 'google-books-cached';
  private readonly refreshInterval = 24 * 60 * 60 * 1000;

  private books: NonNullable<BooksResponse['items']> = [];
  private lastLoadedAt = 0;

  constructor(private readonly http: HttpClient) {
    this.loadDataFromCache();

    // TODO: Do NOT keep API keys in frontend code.
    const savedApiKey = 'AIzaSyD56HjENHiulOm8CepTpMXTI5rBZxWltnA';

    if (savedApiKey) {
      this.initialize(savedApiKey);
    }
  }

  /**
   * Get books from Google Books API
   */
  getAllBooks(apiKey: string): Observable<BooksResponse> {
    const params = new HttpParams()
      .set('q', 'subject:fiction')
      .set('maxResults', '40')
      .set('startIndex', '0')
      .set('printType', 'books')
      .set('orderBy', 'relevance')
      .set('key', apiKey);

    return this.http.get<BooksResponse>(
      'https://www.googleapis.com/books/v1/volumes',
      { params }
    );
  }

  initialize(apiKey: string): void {
    if (!apiKey) {
      return;
    }

    this.loadBooks(apiKey).subscribe({
      next: (response) => {
        console.log('Books loaded:', response.items?.length ?? 0);
      },
      error: (error) => {
        console.error('Failed to load books:', error);
      }
    });
  }

  getBooks(): BooksResponse['items'] {
    return this.books;
  }

  loadBooks(apiKey: string): Observable<BooksResponse> {

    // Use cached books if they are still fresh
    if (
      this.books.length > 0 &&
      Date.now() - this.lastLoadedAt < this.refreshInterval
    ) {
      return of({
        items: this.books,
        totalItems: this.books.length
      } as BooksResponse);
    }

    return this.getAllBooks(apiKey).pipe(

      tap((response) => {
        this.books = response.items ?? [];
        this.lastLoadedAt = Date.now();

        localStorage.setItem(
          this.cacheKey,
          JSON.stringify({
            books: response,
            timestamp: this.lastLoadedAt
          })
        );

        console.log(
          `Loaded ${this.books.length} books from Google Books`
        );
      }),

      catchError((error) => {
        console.error('Google Books API error:', error);

        // Fall back to cached books
        return of({
          items: this.books,
          totalItems: this.books.length
        } as BooksResponse);
      })
    );
  }

  private loadDataFromCache(): void {
    const cachedData = localStorage.getItem(this.cacheKey);

    if (!cachedData) {
      return;
    }

    try {
      const parsed = JSON.parse(cachedData) as {
        books?: BooksResponse;
        timestamp?: number;
      };

      if (parsed.books?.items && parsed.timestamp) {
        this.books = parsed.books.items;
        this.lastLoadedAt = parsed.timestamp;

        console.log(
          `Loaded ${this.books.length} books from cache`
        );
      }

    } catch (error) {
      console.error('Invalid book cache:', error);
      localStorage.removeItem(this.cacheKey);
    }
  }
}
