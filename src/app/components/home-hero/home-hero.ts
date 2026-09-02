import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../icon/icon';

@Component({
    imports: [Icon, RouterLink],
    selector: 'app-home-hero',
    styleUrl: './home-hero.css',
    templateUrl: './home-hero.html',
})
export class HomeHero {
    @Input() eyebrow = 'Discover Your Next Adventure';
    @Input() title = 'A World of Knowledge';
    @Input() highlight = 'at Your Fingertips.';
    @Input() description = 'BookVerse is your premium digital library. Explore thousands of titles, manage your collection, and dive into stories that inspire and educate.';
    @Input() image = 'assets/images/Home-page-hero.png';
    @Output() primaryAction = new EventEmitter<void>();
    @Output() secondaryAction = new EventEmitter<void>();
}
