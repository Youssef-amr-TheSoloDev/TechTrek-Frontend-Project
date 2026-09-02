import { Component } from '@angular/core';
import { SiteLogo } from "../site-logo/site-logo";
import { Icon } from "../icon/icon";

@Component({
  imports: [SiteLogo, Icon],
  selector: 'app-footer',
  styleUrl: './footer.css',
  templateUrl: './footer.html',
})
export class Footer {
  Year: number = new Date().getFullYear();
}
