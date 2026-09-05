import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { ExploreBooks } from './pages/explore-books/explore-books';
import { BookDetails } from './pages/book-details/book-details';
import { AboutPage } from './pages/about-page/about-page';
import { TermsPage } from './pages/terms-page/terms-page';
import { PrivacyPage } from './pages/privacy-page/privacy-page';
import { ContactPage } from './pages/contact-page/contact-page';
import { HelpCenterPage } from './pages/help-center-page/help-center-page';
import { Page404 } from './pages/page404/page404';
import { Login } from './pages/login/login';
import { Registration } from './pages/registration/registration';
import { AccountPreview } from './pages/account-preview/account-preview';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'about', component: AboutPage },
  { path: 'terms', component: TermsPage },
  { path: 'policy', component: PrivacyPage },
  { path: 'contact', component: ContactPage },
  { path: 'help', component: HelpCenterPage },
  { path: 'explore', component: ExploreBooks },
  { path: 'explore/search/:term', component: ExploreBooks },
  { path: 'explore/popular', component: ExploreBooks },
  { path: 'explore/new', component: ExploreBooks },
  { path: 'explore/best-seller', component: ExploreBooks },
  { path: 'explore/category/:category', component: ExploreBooks },
  { path: 'explore/:bookname/details', component: BookDetails },
  { path: 'login', component: Login },
  { path: 'register', component: Registration },
  { path: 'account', component: AccountPreview },
  { path: '**', component: Page404 } // leave this path at the end of this array
];
