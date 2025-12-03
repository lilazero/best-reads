# BookCard Component Usage Guide

## Overview

The `BookCard` component displays a single book in an expandable card format. It wraps the `ExpandableCard` component with book-specific data and styling, including tags, ratings, and optional buy buttons.

## Basic Usage

```typescript
import BookCard from "@/components/DashboardComponents/BookCard";
import type { Book } from "@/lib/types";

function MyComponent() {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const book: Book = {
    id: "1",
    title: "The Great Gatsby",
    description: "A classic American novel",
    longDescription: "Set in the Jazz Age on Long Island...",
    rating: 4.5,
    price: "$12.99",
    src: "/images/gatsby.jpg",
    tags: [
      { id: "fiction", value: "Fiction" },
      { id: "classic", value: "Classic" }
    ]
  };

  return (
    <BookCard
      book={book}
      index={0}
      showBuyButton={true}
      isActive={activeCardId === book.id}
      onActivate={() => setActiveCardId(book.id)}
      onDeactivate={() => setActiveCardId(null)}
    />
  );
}
```

## Props

| Prop            | Type           | Required | Description                                                    |
| --------------- | -------------- | -------- | -------------------------------------------------------------- |
| `book`        | `Book`       | Yes      | Book object containing all book information                    |
| `index`       | `number`     | Yes      | Position in list (used for review count calculation)           |
| `showBuyButton` | `boolean`    | No       | Whether to display the buy/action button. Default: `true`    |
| `isActive`    | `boolean`    | Yes      | Whether this card is currently expanded                        |
| `onActivate`  | `() => void` | Yes      | Callback when card should expand                               |
| `onDeactivate` | `() => void` | Yes      | Callback when card should collapse                             |

## Book Type Properties

The `book` prop expects an object with these properties:

| Property            | Type              | Required | Description                              |
| ------------------- | ----------------- | -------- | ---------------------------------------- |
| `id`              | `string`        | Yes      | Unique identifier for the book           |
| `title`           | `string`        | Yes      | Book title                               |
| `description`     | `string`        | No       | Short description shown in collapsed view |
| `longDescription` | `string`        | No       | Full description shown when expanded     |
| `rating`          | `number`        | No       | Rating value (e.g., 4.5)                 |
| `price`           | `string`        | No       | Price string (e.g., "$12.99")            |
| `src`             | `string`        | No       | Image URL for the book cover             |
| `tags`            | `Tag[]`         | No       | Array of tag objects with id and value   |

## Features

### Dynamic Tag Icons
- Tags are automatically mapped to Lucide icons from the tag catalog
- Falls back to `BookOpen` icon if no match is found
- First tag appears in the collapsed card preview

### Rating Display
- Shows 5-star rating visualization
- Includes calculated review count based on index
- Displays in expanded view

### Optional Buy Button
- When `showBuyButton` is `true`:
  - Shows "Buy for {price}" if price exists
  - Shows "Learn More" if no price
- When `false`, no button is shown

### Expanded Content
The expanded card displays:
- Full book description
- All tags with icons
- Star rating with review count

## Example: Without Buy Button

```typescript
<BookCard
  book={book}
  index={0}
  showBuyButton={false}
  isActive={activeCardId === book.id}
  onActivate={() => setActiveCardId(book.id)}
  onDeactivate={() => setActiveCardId(null)}
/>
```

## Example: Minimal Book Data

```typescript
const minimalBook: Book = {
  id: "2",
  title: "Simple Book",
  description: "A basic book entry"
  // No tags, rating, or price - component handles gracefully
};
```

## Tips

- The `index` prop affects the review count display (calculated as `120 + index * 9`)
- Tags use dynamic icon resolution - ensure tag IDs match your tag catalog
- The component gracefully handles missing optional properties
- Only one card should be expanded at a time - manage state in the parent component
