export type Book = {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: {
    title: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
    readingModes?: {
      text: boolean;
      image: boolean;
    };
    pageCount?: number;
    printType?: string;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    maturityRating?: string;
    allowAnonLogging?: boolean;
    contentVersion?: string;
    panelizationSummary?: {
      containsEpubBubbles: boolean;
      containsImageBubbles: boolean;
    };
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
      extraLarge?: string;
    };
    language?: string;
    previewLink?: string;
    infoLink?: string;
    canonicalVolumeLink?: string;
  };
  saleInfo?: {
    country?: string;
    saleability?: string;
    isEbook?: boolean;
    listPrice?: {
      amount: number;
      currencyCode: string;
    };
    retailPrice?: {
      amount: number;
      currencyCode: string;
    };
    buyLink?: string;
    offers?: Array<{
      finskyOfferType: number;
      listPrice: {
        amountInMicros: number;
        currencyCode: string;
      };
      retailPrice: {
        amountInMicros: number;
        currencyCode: string;
      };
    }>;
  };
  accessInfo?: {
    country?: string;
    viewability?: string;
    embeddable?: boolean;
    publicDomain?: boolean;
    textToSpeechPermission?: string;
    epub?: {
      isAvailable: boolean;
      acsTokenLink?: string;
    };
    pdf?: {
      isAvailable: boolean;
      acsTokenLink?: string;
    };
    webReaderLink?: string;
    accessViewStatus?: string;
    quoteSharingAllowed?: boolean;
  };
  searchInfo?: {
    textSnippet?: string;
  };
};

export type UserRole = 'user' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
  stats?: UserStats;
  borrows?: Borrow[];
  purchases?: Purchase[];
  activities?: UserActivity[];
  sessions?: AuthSession[];
};


export type BorrowStatus =
  | 'active'
  | 'due-soon'
  | 'overdue'
  | 'returned';

export type Borrow = {
  id: string;
  userId: string;
  bookId: string;

  borrowedAt: string;
  dueDate: string;
  returnedAt?: string;

  status: BorrowStatus;
};

export type Purchase = {
  id: string;
  userId: string;
  bookId: string;

  price: number;
  currency: string;

  purchasedAt: string;
};

export type BorrowedBook = {
  borrow: Borrow;
  book: Book;
};

export type PurchasedBook = {
  purchase: Purchase;
  book: Book;
};

export type ActivityType =
  | 'borrowed'
  | 'returned'
  | 'purchased';

export type UserActivity = {
  id: string;
  userId: string;
  bookId: string;

  type: ActivityType;
  createdAt: string;
};


export type UserStats = {
  borrowedCount: number;
  purchasedCount: number;
  dueSoonCount: number;
  overdueCount: number;
};

export type AuthSession = {
  userId: string;
  loggedInAt: string;
};

export type BooksResponse = {
  kind: string;
  totalItems: number;
  items?: Book[];
};
