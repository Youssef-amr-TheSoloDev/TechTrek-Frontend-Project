import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  combineLatest,
  Observable,
  Subscription
} from 'rxjs';

import { Book } from '../../../types/types.type';
import { BookData } from '../../../services/book-data';
import { HomeBookCard } from '../../components/home-book-card/home-book-card';
import { Icon } from '../../components/icon/icon';

@Component({
  selector: 'app-explore-books',
  imports: [FormsModule, HomeBookCard, Icon, RouterLink],
  templateUrl: './explore-books.html',
  styleUrl: './explore-books.css',
})
export class ExploreBooks implements OnInit, OnDestroy {

  readonly books = signal<Book[]>([]);

  searchTerm = '';
  searchInput = '';
  selectedCategory = 'All';
  sortOrder: 'relevance' | 'newest' = 'relevance';
  heading = 'Explore Books';
  description =
    'Browse the latest reads and discover your next favorite book.';

  totalItems = 0;
  currentPage = 1;

  readonly pageSize = 20;

  isLoading = signal<boolean>(true);

  private routeSubscription?: Subscription;
  private requestSubscription?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly bookData: BookData
  ) { }

  ngOnInit(): void {
    this.watchRoute();
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.requestSubscription?.unsubscribe();
  }

  private watchRoute(): void {
    this.routeSubscription = combineLatest([
      this.route.paramMap,
      this.route.queryParamMap,
      this.route.url
    ]).subscribe(([params, queryParams, segments]) => {

      const term = params.get('term');
      const category = params.get('category');

      const routeSegments = segments.map(segment => segment.path);

      const isPopular = routeSegments.includes('popular');
      const isNew = routeSegments.includes('new');
      const isBestSeller = routeSegments.includes('best-seller');

      this.currentPage = Math.max(
        1,
        Number(queryParams.get('page')) || 1
      );
      this.sortOrder = queryParams.get('sort') === 'newest' ? 'newest' : 'relevance';

      this.searchTerm = term
        ? decodeURIComponent(term)
        : '';
      this.searchInput = this.searchTerm;
      this.selectedCategory = category || 'All';

      this.loadBooks({
        term,
        category,
        isPopular,
        isNew,
        isBestSeller
      });
    });
  }

  private loadBooks(options: {
    term: string | null;
    category: string | null;
    isPopular: boolean;
    isNew: boolean;
    isBestSeller: boolean;
  }): void {

    this.isLoading.set(true);

    const request = this.getBookRequest(options);

    this.requestSubscription?.unsubscribe();

    this.requestSubscription = request.subscribe({
      next: response => {
        this.totalItems = response.totalItems;
        this.books.set(response.items ?? []);
        this.isLoading.set(false);
      },

      error: () => {
        this.books.set([]);
        this.totalItems = 0;
        this.isLoading.set(false);
      }
    });
  }

  private getBookRequest(options: {
    term: string | null;
    category: string | null;
    isPopular: boolean;
    isNew: boolean;
    isBestSeller: boolean;
  }): Observable<{
    items?: Book[];
    totalItems: number;
  }> {

    const {
      term,
      category,
      isPopular,
      isNew,
      isBestSeller
    } = options;

    if (term) {
      this.heading = `Search results for "${this.searchTerm}"`;
      this.description =
        'Results from the BookVerse library.';

      return this.bookData.searchBooks(
        this.searchTerm,
        this.currentPage,
        this.sortOrder
      );
    }

    if (category) {
      this.heading = 'Explore Books';
      this.description =
        `Explore our collection of ${category.toLowerCase()} books.`;

      return this.bookData.getBooksByCategory(
        category,
        this.currentPage,
        this.sortOrder
      );
    }

    if (isNew) {
      this.heading = 'New Arrivals';
      this.description =
        'Fresh additions to the BookVerse library.';

      return this.bookData.getNewBooks(this.currentPage, this.sortOrder);
    }

    if (isBestSeller) {
      this.heading = 'Best Sellers';
      this.description =
        'Discover the titles readers are buying and recommending most.';

      return this.bookData.getBestSellerBooks(this.currentPage, this.sortOrder);
    }

    this.heading = isPopular
      ? 'Popular Books'
      : 'Explore Books';

    this.description = isPopular
      ? 'Discover the books readers are loving right now.'
      : 'Browse the latest reads and discover your next favorite book.';

    return this.bookData.getPopularBooks(this.currentPage, this.sortOrder);
  }

  submitSearch(event: Event): void {
    event.preventDefault();
    const term = this.searchInput.trim();
    if (!term) return;

    this.router.navigate(['/explore/search', term], {
      queryParams: { page: 1, sort: this.sortOrder },
    });
  }

  changeCategory(): void {
    const route = this.selectedCategory === 'All'
      ? ['/explore']
      : ['/explore/category', this.selectedCategory];
    this.router.navigate(route, { queryParams: { page: 1, sort: this.sortOrder } });
  }

  changeSort(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: 1, sort: this.sortOrder },
      queryParamsHandling: 'merge',
    });
  }

  get pageCount(): number {
    return Math.max(
      1,
      Math.ceil(this.totalItems / this.pageSize)
    );
  }

  get pageNumbers(): number[] {
    return Array.from(
      { length: this.pageCount },
      (_, index) => index + 1
    );
  }

  goToPage(page: number): void {
    if (
      page < 1 ||
      page > this.pageCount ||
      page === this.currentPage
    ) {
      return;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge'
    });
  }
}
