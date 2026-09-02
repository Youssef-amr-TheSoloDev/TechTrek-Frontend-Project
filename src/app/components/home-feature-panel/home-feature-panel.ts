import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../icon/icon';

export interface HomeFeature { icon: string; title: string; text: string; }

@Component({
    imports: [Icon, RouterLink],
    selector: 'app-home-feature-panel',
    styleUrl: './home-feature-panel.css',
    templateUrl: './home-feature-panel.html',
})
export class HomeFeaturePanel {
    @Input() title = 'Why Readers Choose BookVerse?';
    @Input() description = "We're more than just a store. We're a platform built by bibliophiles, for bibliophiles, designed to elevate every aspect of your reading life.";
    @Input() image = 'assets/images/Home-page-hero.png';
    @Input() features: HomeFeature[] = [];
}
