import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../icon/icon';

@Component({
    imports: [Icon, RouterLink],
    selector: 'app-home-section-heading',
    styleUrl: './home-section-heading.css',
    templateUrl: './home-section-heading.html',
})
export class HomeSectionHeading {
    @Input() eyebrow = '';
    @Input() title = '';
    @Input() description = '';
    @Input() actionLabel = '';
    @Input() actionIcon = 'arrow-right';
}
