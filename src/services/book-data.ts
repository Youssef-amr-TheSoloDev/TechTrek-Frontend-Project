import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { BooksResponse } from '../types/types.type';

@Injectable()
export class BookData {
  private readonly cacheKey = 'book-data-cache';
  private readonly refreshInterval = 24 * 60 * 60 * 1000;
  private books: NonNullable<BooksResponse['items']> = [];
  private lastLoadedAt = 0;

  constructor(private readonly http: HttpClient) {
    this.loadDataFromCache();

    const savedApiKey = "AIzaSyD56HjENHiulOm8CepTpMXTI5rBZxWltnA"; // todo: move it to the backend ASAP

    if (savedApiKey) {
      this.initialize(savedApiKey);
    }
  }

  getAllBooks(apiKey: string): Observable<BooksResponse> {
    const params = new HttpParams()
      .set('q', '*')
      .set('maxResults', '40')
      .set('key', apiKey);

    return this.http.get<BooksResponse>('https://www.googleapis.com/books/v1/volumes', {
      params,
    });
  }

  initialize(apiKey: string): void {
    if (!apiKey) {
      return;
    }

    this.loadBooks(apiKey).subscribe();
  }

  getBooks(): BooksResponse['items'] {
    return this.books;
  }

  loadBooks(apiKey: string): Observable<BooksResponse> {
    if (this.books.length > 0 && Date.now() - this.lastLoadedAt < this.refreshInterval) {
      return of({ items: this.books } as BooksResponse);
    }

    return this.getAllBooks(apiKey).pipe(
      tap((response) => {
        this.books = response.items ?? [];
        this.lastLoadedAt = Date.now();

        localStorage.setItem(
          this.cacheKey,
          JSON.stringify({
            books: response,
            timestamp: this.lastLoadedAt,
          }),
        );
      }),
    );
  }

  private loadDataFromCache(): void {
    const cachedData = localStorage.getItem(this.cacheKey);

    if (!cachedData) {
      return;
    }

    try {
      const parsed = JSON.parse(cachedData) as { books?: BooksResponse; timestamp?: number };

      if (parsed.books?.items && parsed.timestamp) {
        this.books = parsed.books.items;
        this.lastLoadedAt = parsed.timestamp;
      }
    } catch {
      localStorage.removeItem(this.cacheKey);
    }
  }
}
