# BookCardList Component Usage Guide

## Overview

The `BookCardList` component displays a collection of books in a responsive grid layout. It manages the state for which card is currently expanded and automatically handles body scroll locking when a card is open.

## Basic Usage

```typescript
import BookCardList from "@/components/DashboardComponents/BookCardList";
import type { Book } from "@/lib/types";

function MyComponent() {
  const books: Book[] = [
    {
      id: "1",
      title: "The Great Gatsby",
      description: "A classic American novel",
      rating: 4.5,
      src: "/images/gatsby.jpg"
    },
    {
      id: "2",
      title: "1984",
      description: "Dystopian social science fiction",
      rating: 4.7,
      src: "/images/1984.jpg"
    }
  ];

  return (
    <BookCardList 
      books={books} 
      showBuyButton={true} 
    />
  );
}
```

## Props

| Prop            | Type        | Required | Description                                                    |
| --------------- | ----------- | -------- | -------------------------------------------------------------- |
| `books`       | `Book[]`  | Yes      | Array of Book objects to display in the grid                   |
| `showBuyButton` | `boolean` | No       | Whether to show buy buttons on cards. Default: `true`        |

## Features

### Automatic State Management
- Manages `activeCardId` state internally
- Ensures only one card can be expanded at a time
- Passes expand/collapse callbacks to each `BookCard`

### Scroll Lock
- When a card is expanded, body scroll is disabled (`overflow: hidden`)
- When closed, scroll is restored (`overflow: auto`)
- Prevents background scrolling while viewing expanded cards

### Responsive Grid Layout
The grid automatically adjusts based on screen size:
- **Mobile**: 1 column
- **Tablet (md)**: 2 columns
- **Desktop (xl)**: 3 columns

### Default Title
- Displays "Recommended Books" as the section heading
- Title is styled with `text-2xl font-bold mb-6 px-4`

## Customization Examples

### Without Buy Buttons

```typescript
<BookCardList 
  books={myBooks} 
  showBuyButton={false} 
/>
```

### With Custom Book Data

```typescript
const books: Book[] = [
  {
    id: "1",
    title: "Clean Code",
    description: "A handbook of agile software craftsmanship",
    longDescription: "Detailed guide to writing maintainable code...",
    rating: 4.8,
    price: "$34.99",
    src: "/books/clean-code.jpg",
    tags: [
      { id: "programming", value: "Programming" },
      { id: "software", value: "Software Engineering" }
    ]
  }
];

<BookCardList books={books} />
```

## Layout Structure

```
<div className="mt-20">                              // Container with top margin
  <h2 className="text-2xl font-bold mb-6 px-4">    // Section heading
    Recommended Books
  </h2>
  <div className="grid gap-1 md:grid-cols-2 xl:grid-cols-3">  // Responsive grid
    {/* BookCard components mapped here */}
  </div>
</div>
```

## Integration Example

```typescript
"use client";

import BookCardList from "@/components/DashboardComponents/BookCardList";
import { RecommendedBooks } from "@/lib/mockData";

export default function HomePage() {
  return (
    <div className="container mx-auto">
      <BookCardList books={RecommendedBooks} showBuyButton={false} />
    </div>
  );
}
```

## Tips

- The component handles all expand/collapse state internally - no parent state management needed
- Each book needs a unique `id` property for proper state tracking
- The `index` prop is automatically provided to each `BookCard` based on array position
- Combine with other dashboard components to build a complete page layout
- The hardcoded "Recommended Books" title may be made customizable in future versions
