import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    imports: [FormsModule],
    selector: 'app-home-newsletter',
    styleUrl: './home-newsletter.css',
    templateUrl: './home-newsletter.html',
})
export class HomeNewsletter {
    @Input() title = 'Stay in the Literary Loop';
    @Input() description = 'Get monthly curated reading lists, exclusive author interviews, and first access to seasonal sales delivered straight to your inbox.';
    @Output() subscribed = new EventEmitter<string>();
    email = '';

    submit(): void {
        const email = this.email.trim();
        if (!email) return;
        this.subscribed.emit(email);
        this.email = '';
    }
}
