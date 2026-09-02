import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { ExploreBooks } from './pages/explore-books/explore-books';
import { BookDetails } from './pages/book-details/book-details';
import { Page404 } from './pages/page404/page404';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'explore', component: ExploreBooks },
  { path: 'details/:bookname', component: BookDetails },
  { path: '**', component: Page404 } // leave this path at the end of this array
];
