# ExpandableCard Component Usage Guide

## Overview

The `ExpandableCard` component creates an interactive card that can expand to show additional content. It's designed for displaying book information, products, or any content that benefits from a compact preview with detailed expansion.

## Basic Usage

```typescript
import { ExpandableCard } from "@/components/ui/expandableCard";
import { Star } from "lucide-react";

function MyComponent() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const cardData = {
    id: "unique-card-id",
    title: "Card Title",
    description: "Short preview text",
    rating: "4.5",
    firstTag: <span>Optional Tag</span>,
    src: "/path/to/image.jpg",
    ctaText: "Action Button",
    ctaLink: "#",
    content: () => <div>Expanded content goes here</div>,
  };

  return (
    <ExpandableCard
      card={cardData}
      isActive={activeCard === cardData.id}
      onActivate={() => setActiveCard(cardData.id)}
      onDeactivate={() => setActiveCard(null)}
    />
  );
}
```

## CardData Properties

| Property        | Type                | Required | Description                                            |
| --------------- | ------------------- | -------- | ------------------------------------------------------ |
| `id`          | `string`          | Yes      | Unique identifier for the card                         |
| `title`       | `string`          | Yes      | Main heading displayed on the card                     |
| `description` | `string`          | Yes      | Short preview text shown in collapsed state            |
| `rating`      | `string`          | No       | Numerical rating value (e.g., "4.5")                   |
| `firstTag`    | `ReactNode`       | No       | A tag/badge element displayed in the card header       |
| `src`         | `string`          | Yes      | Image URL for the card thumbnail                       |
| `ctaText`     | `string`          | No       | Text for the call-to-action button (e.g., "Buy Now")   |
| `ctaLink`     | `string`          | No       | URL for the CTA button. If omitted, no button is shown |
| `content`     | `() => ReactNode` | Yes      | Function returning the expanded content JSX            |

## ExpandableCard Props

| Prop             | Type           | Required | Description                              |
| ---------------- | -------------- | -------- | ---------------------------------------- |
| `card`         | `CardData`   | Yes      | Object containing all card configuration |
| `isActive`     | `boolean`    | Yes      | Whether this card is currently expanded  |
| `onActivate`   | `() => void` | Yes      | Callback when card should expand         |
| `onDeactivate` | `() => void` | Yes      | Callback when card should collapse       |
| `cardClassName` | `string`     | No       | Custom CSS classes for the collapsed card container. Defaults to hover and padding styles |

## Example: Product Card

```typescript
const productCard = {
  id: "product-1",
  title: "Premium Headphones",
  description: "Noise-cancelling with 30hr battery",
  rating: "4.8",
  firstTag: <span className="badge">New</span>,
  src: "/images/headphones.jpg",
  ctaText: "Buy for $299",
  ctaLink: "/checkout/product-1",
  content: () => (
    <div>
      <h4>Features</h4>
      <ul>
        <li>Active noise cancellation</li>
        <li>Bluetooth 5.0</li>
        <li>30-hour battery life</li>
      </ul>
    </div>
  ),
};
```

## Tips

- Use state management to control which card is active (only one should expand at a time)
- The `content` function allows dynamic content generation
- Set `ctaText` and `ctaLink` to `undefined` to hide the action button
- The `firstTag` can be any React element for custom badge styling
