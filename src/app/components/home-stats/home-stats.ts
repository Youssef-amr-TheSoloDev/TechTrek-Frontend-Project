import { Component, Input } from '@angular/core';
import { Icon } from '../icon/icon';

export interface HomeStat { icon: string; value: string; label: string; }

@Component({
    imports: [Icon],
    selector: 'app-home-stats',
    styleUrl: './home-stats.css',
    templateUrl: './home-stats.html',
})
export class HomeStats {
    @Input() stats: HomeStat[] = [];
}
