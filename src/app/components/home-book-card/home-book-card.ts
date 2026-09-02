import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../icon/icon';
import { Book } from '../../../types/types.type';

@Component({
  imports: [Icon, RouterLink],
  selector: 'app-home-book-card',
  styleUrl: './home-book-card.css',
  templateUrl: './home-book-card.html',
})
export class HomeBookCard {
  @Input({ required: true }) book!: Book;
  @Output() selected = new EventEmitter<Book>();

  get title(): string { return this.book.volumeInfo.title; }
  get author(): string { return this.book.volumeInfo.authors?.join(', ') || 'Unknown author'; }
  get genre(): string { return this.book.volumeInfo.categories?.[0] || 'Books'; }
  get rating(): string { return this.book.volumeInfo.averageRating?.toFixed(1) || 'New'; }
  get ratingCount(): string { return this.book.volumeInfo.ratingsCount ? `(${this.book.volumeInfo.ratingsCount})` : ''; }
  get price(): string {
    const price = this.book.saleInfo?.retailPrice || this.book.saleInfo?.listPrice;
    return price ? `${price.currencyCode} ${price.amount.toFixed(2)}` : 'View details';
  }
  get coverImage(): string {
    return (this.book.volumeInfo.imageLinks?.thumbnail || this.book.volumeInfo.imageLinks?.smallThumbnail || '').replace('http://', 'https://');
  }
}
