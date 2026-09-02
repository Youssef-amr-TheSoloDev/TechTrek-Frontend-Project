import { Component } from '@angular/core';
import { SiteLogo } from "../site-logo/site-logo";

@Component({
  imports: [SiteLogo],
  selector: 'app-footer',
  styleUrl: './footer.css',
  templateUrl: './footer.html',
})
export class Footer {
  Year: number = new Date().getFullYear();
}
