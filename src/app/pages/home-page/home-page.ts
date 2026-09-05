import { Component, OnInit, signal } from '@angular/core';
import { Book, User } from '../../../types/types.type';
import { BookData } from '../../../services/book-data';
import { HomeBookCard } from '../../components/home-book-card/home-book-card';
import { HomeCategory, HomeCategoryCard } from '../../components/home-category-card/home-category-card';
import { HomeFeature, HomeFeaturePanel } from '../../components/home-feature-panel/home-feature-panel';
import { HomeHero } from '../../components/home-hero/home-hero';
import { HomeNewsletter } from '../../components/home-newsletter/home-newsletter';
import { HomeSectionHeading } from '../../components/home-section-heading/home-section-heading';
import { HomeStat, HomeStats } from '../../components/home-stats/home-stats';
import { UserData } from '../../../services/user-data';

@Component({
  imports: [HomeBookCard, HomeCategoryCard, HomeFeaturePanel, HomeHero, HomeNewsletter, HomeSectionHeading, HomeStats],
  selector: 'app-home-page',
  styleUrl: './home-page.css',
  templateUrl: './home-page.html',
})
export class HomePage implements OnInit {
  books: Book[] = [];
  isLoading = true;

  constructor(private readonly bookData: BookData, private readonly users: UserData) { }

  ngOnInit(): void {
    this.bookData.books$.subscribe((books) => {
      this.books = books;
      this.isLoading = false;
    });
  }

  get editorPicks(): Book[] { return this.books.slice(0, 3); }
  get communityFavorites(): Book[] { return this.books.slice(3, 7); }

  readonly stats: HomeStat[] = [
    { icon: 'book-open', value: '50k+', label: 'Books Available' },
    { icon: 'users', value: '120k+', label: 'Happy Readers' },
    { icon: 'globe', value: '45+', label: 'Countries Reached' },
    { icon: 'trophy', value: '15', label: 'Expert Curators' },
  ];

  readonly categories: HomeCategory[] = [
    { name: 'Fiction', count: '12,400+', image: 'assets/images/Explore-Category-1.png' },
    { name: 'History', count: '8,200+', image: 'assets/images/Explore-Category-2.png' },
    { name: 'Science', count: '5,600+', image: 'assets/images/Explore-Category-3.png' },
  ];

  readonly features: HomeFeature[] = [
    { icon: 'shield-check', title: 'Offline Access', text: 'Read your favorite books even without internet connection.' },
    { icon: 'chart-no-axes-combined', title: 'Personalized Picks', text: 'AI-driven recommendations based on your unique reading style.' },
    { icon: 'clock-3', title: 'Cloud Sync', text: 'Start on your phone, finish on your laptop. Everything syncs.' },
    { icon: 'bookmark', title: 'Digital Shelf', text: 'Organize your collection with private virtual reading tags.' },
  ];

  onHeroPrimaryAction(): void { }
  onCategorySelected(category: HomeCategory): void { console.debug('Selected category:', category.name); }
  onSubscribed(email: string): void { console.debug('Newsletter subscription:', email); }
}
