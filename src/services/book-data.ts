import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';
import { BooksResponse } from '../types/types.type';

@Injectable({
  providedIn: 'root'
})
export class BookData {

  private readonly apiKey = 'AIzaSyD56HjENHiulOm8CepTpMXTI5rBZxWltnA';
  private readonly cachePrefix = 'bookverse-books:';
  private readonly cacheLifetime = 24 * 60 * 60 * 1000;

  private books: NonNullable<BooksResponse['items']> = [];
  private readonly booksSubject = new BehaviorSubject<NonNullable<BooksResponse['items']>>([]);
  readonly books$ = this.booksSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    if (this.apiKey) {
      this.initialize(this.apiKey);
    }
  }

  /**
   * Get books from Google Books API
   */
  getAllBooks(apiKey: string, page = 1): Observable<BooksResponse> {
    const params = new HttpParams()
      .set('q', 'subject:fiction')
      .set('maxResults', '20')
      .set('startIndex', String((page - 1) * 20))
      .set('printType', 'books')
      .set('orderBy', 'relevance')
      .set('key', apiKey);

    return this.http.get<BooksResponse>(
      'https://www.googleapis.com/books/v1/volumes',
      { params }
    );
  }

  searchBooks(term: string, page = 1, orderBy: 'relevance' | 'newest' = 'relevance'): Observable<BooksResponse> {
    return this.queryBooks(`intitle:${term.trim()}`, orderBy, page);
  }

  getPopularBooks(page = 1, orderBy: 'relevance' | 'newest' = 'relevance'): Observable<BooksResponse> {
    return this.queryBooks('subject:fiction', orderBy, page);
  }

  getBooksByCategory(category: string, page = 1, orderBy: 'relevance' | 'newest' = 'relevance'): Observable<BooksResponse> {
    return this.queryBooks(`subject:${category.trim()}`, orderBy, page);
  }

  getNewBooks(page = 1, orderBy: 'relevance' | 'newest' = 'newest'): Observable<BooksResponse> {
    return this.queryBooks('subject:fiction', orderBy, page);
  }

  getBestSellerBooks(page = 1, orderBy: 'relevance' | 'newest' = 'relevance'): Observable<BooksResponse> {
    return this.queryBooks('bestseller', orderBy, page);
  }

  getBookById(id: string): Observable<NonNullable<BooksResponse['items']>[number] | undefined> {
    const loadedBook = this.books.find((book) => book.id === id);
    if (loadedBook) {
      return of(loadedBook);
    }

    const cacheKey = `${this.cachePrefix}detail:${id}`;
    const cachedBook = this.readCache<NonNullable<BooksResponse['items']>[number]>(cacheKey);
    if (cachedBook) {
      return of(cachedBook);
    }

    return this.http.get<NonNullable<BooksResponse['items']>[number]>(
      `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`,
      { params: new HttpParams().set('key', this.apiKey) }
    ).pipe(
      timeout(10000),
      tap((book) => this.writeCache(cacheKey, book)),
      catchError(() => of(undefined)),
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

  loadBooks(apiKey: string, page = 1): Observable<BooksResponse> {
    const cacheKey = `${this.cachePrefix}initial:${page}`;
    const cachedBooks = this.readCache<BooksResponse>(cacheKey);
    if (cachedBooks) {
      this.publishBooks(cachedBooks);
      return of(cachedBooks);
    }

    return this.getAllBooks(apiKey, page).pipe(

      tap((response) => {
        this.publishBooks(response);
        this.writeCache(cacheKey, response);

        console.log(
          `Loaded ${this.books.length} books from Google Books`
        );
      }),

      catchError((error) => {
        console.error('Google Books API error:', error);

        return of({
          kind: 'books#volumes',
          items: [],
          totalItems: 0
        } as BooksResponse);
      })
    );
  }

  private queryBooks(query: string, orderBy: 'relevance' | 'newest' = 'relevance', page = 1): Observable<BooksResponse> {
    console.log(query, page);
    const cacheKey = `${this.cachePrefix}query:${query}:${orderBy}:${page}`;
    const cachedBooks = this.readCache<BooksResponse>(cacheKey);
    if (cachedBooks) {
      this.publishBooks(cachedBooks);
      return of(cachedBooks);
    }

    const params = new HttpParams()
      .set('q', query)
      .set('maxResults', '20')
      .set('startIndex', String((page - 1) * 20))
      .set('printType', 'books')
      .set('orderBy', orderBy)
      .set('key', this.apiKey);

    return this.http.get<BooksResponse>('https://www.googleapis.com/books/v1/volumes', { params }).pipe(
      timeout(10000),
      tap((response) => {
        this.publishBooks(response);
        this.writeCache(cacheKey, response);
      }),
      catchError(() => of({ kind: 'books#volumes', items: [], totalItems: 0 } as BooksResponse))
    );
  }

  private publishBooks(response: BooksResponse): void {
    this.books = response.items ?? [];
    this.booksSubject.next(this.books);
  }

  private readCache<T>(key: string): T | undefined {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) {
        return undefined;
      }

      const entry = JSON.parse(cached) as { data?: T; timestamp?: number };
      if (!entry.data || !entry.timestamp || Date.now() - entry.timestamp >= this.cacheLifetime) {
        localStorage.removeItem(key);
        return undefined;
      }

      return entry.data;
    } catch {
      localStorage.removeItem(key);
      return undefined;
    }
  }

  private writeCache<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
    } catch {
      // Ignore storage quota and restricted-storage errors.
    }
  }

}
