import { Component, Input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-icon',
  styleUrl: './icon.css',
  templateUrl: './icon.html',
})
export class Icon {
  @Input() ImagePath!: string;
  @Input() Color: string = 'var(--color-text)';
  @Input() Size: string = '1.5em';
}
