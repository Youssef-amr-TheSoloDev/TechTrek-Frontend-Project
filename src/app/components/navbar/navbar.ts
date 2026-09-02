import { Component } from '@angular/core';
import { SiteLogo } from "../site-logo/site-logo";

@Component({
  imports: [SiteLogo],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar { }
