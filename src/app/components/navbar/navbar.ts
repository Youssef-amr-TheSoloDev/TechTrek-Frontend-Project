import { Component } from '@angular/core';
import { SiteLogo } from "../site-logo/site-logo";
import { Icon } from "../icon/icon";

@Component({
  imports: [SiteLogo, Icon],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar { }
