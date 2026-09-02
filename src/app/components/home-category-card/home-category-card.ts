import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../icon/icon';

export interface HomeCategory { name: string; count: string; image: string; }

@Component({
    imports: [Icon, RouterLink],
    selector: 'app-home-category-card',
    styleUrl: './home-category-card.css',
    templateUrl: './home-category-card.html',
})
export class HomeCategoryCard {
    @Input({ required: true }) category!: HomeCategory;
    @Output() selected = new EventEmitter<HomeCategory>();
}
