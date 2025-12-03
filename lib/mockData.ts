import { Tag } from "./types";
import { Book } from "./types";

export const tags: Tag[] = [
  { id: "t1", value: "feature", icon: "Star" },
  { id: "t2", value: "fix", icon: "Wrench" },
  { id: "t3", value: "bug", icon: "Bug" },
  { id: "t4", value: "docs", icon: "BookOpen" },
  { id: "t5", value: "internal", icon: "Lock" },
  { id: "t6", value: "mobile", icon: "Smartphone" },
  { id: "c-accordion", value: "component: accordion", icon: "ChevronDown" },
  {
    id: "c-alert-dialog",
    value: "component: alert dialog",
    icon: "AlertCircle",
  },
  { id: "c-autocomplete", value: "component: autocomplete", icon: "Search" },
  { id: "c-avatar", value: "component: avatar", icon: "User" },
  { id: "c-checkbox", value: "component: checkbox", icon: "CheckSquare" },
  {
    id: "c-checkbox-group",
    value: "component: checkbox group",
    icon: "CheckSquare2",
  },
  { id: "c-collapsible", value: "component: collapsible", icon: "ChevronsUp" },
  { id: "c-combobox", value: "component: combobox", icon: "List" },
  {
    id: "c-context-menu",
    value: "component: context menu",
    icon: "MoreVertical",
  },
  { id: "c-dialog", value: "component: dialog", icon: "MessageSquare" },
  { id: "c-field", value: "component: field", icon: "Type" },
  { id: "c-fieldset", value: "component: fieldset", icon: "Square" },
  {
    id: "c-filterable-menu",
    value: "component: filterable menu",
    icon: "Filter",
  },
  { id: "c-form", value: "component: form", icon: "FileText" },
  { id: "c-input", value: "component: input", icon: "Type" },
  { id: "c-menu", value: "component: menu", icon: "Menu" },
  { id: "c-menubar", value: "component: menubar", icon: "BarChart3" },
  { id: "c-meter", value: "component: meter", icon: "Gauge" },
  {
    id: "c-navigation-menu",
    value: "component: navigation menu",
    icon: "Navigation",
  },
  { id: "c-number-field", value: "component: number field", icon: "Hash" },
  { id: "c-popover", value: "component: popover", icon: "Zap" },
  { id: "c-preview-card", value: "component: preview card", icon: "Eye" },
  { id: "c-progress", value: "component: progress", icon: "BarChart" },
  { id: "c-radio", value: "component: radio", icon: "Radio" },
  { id: "c-scroll-area", value: "component: scroll area", icon: "ScrollText" },
  { id: "c-select", value: "component: select", icon: "ChevronDown" },
  { id: "c-separator", value: "component: separator", icon: "Minus" },
  { id: "c-slider", value: "component: slider", icon: "Slider" },
  { id: "c-switch", value: "component: switch", icon: "ToggleRight" },
  { id: "c-tabs", value: "component: tabs", icon: "Layers" },
  { id: "c-toast", value: "component: toast", icon: "Bell" },
  { id: "c-toggle", value: "component: toggle", icon: "ToggleLeft" },
  {
    id: "c-toggle-group",
    value: "component: toggle group",
    icon: "ToggleRight",
  },
  { id: "c-toolbar", value: "component: toolbar", icon: "Settings" },
  { id: "c-tooltip", value: "component: tooltip", icon: "HelpCircle" },
];

export const RecommendedBooks: Book[] = [
  {
    id: "b1",
    title: "The Great Gatsby",
    src: "https://img.freepik.com/free-photo/close-book-with-blue-cover_1101-92.jpg?semt=ais_hybrid&w=740&q=80",
    price: "$12.99",
    description:
      "A classic American novel about wealth and love in the Jazz Age.",
    tags: [
      { id: "t1", value: "feature" },
      { id: "t2", value: "fix" },
      { id: "t4", value: "docs" },
    ],
  },
  {
    id: "b2",
    title: "To Kill a Mockingbird",
    src: "https://img.freepik.com/free-photo/close-book-with-blue-cover_1101-92.jpg?semt=ais_hybrid&w=740&q=80",
    price: "$10.99",
    description: "A gripping tale of racial injustice and childhood innocence.",
    tags: [
      { id: "t2", value: "fix" },
      { id: "t4", value: "docs" },
      { id: "t5", value: "internal" },
    ],
  },
  {
    id: "b3",
    title: "1984",
    src: "https://img.freepik.com/free-photo/close-book-with-blue-cover_1101-92.jpg?semt=ais_hybrid&w=740&q=80",
    price: "$13.99",
    description:
      "A dystopian novel exploring totalitarianism and surveillance.",
    tags: [
      { id: "t3", value: "bug" },
      { id: "t1", value: "feature" },
      { id: "t5", value: "internal" },
    ],
  },
  {
    id: "b4",
    title: "Pride and Prejudice",
    src: "https://img.freepik.com/free-photo/close-book-with-blue-cover_1101-92.jpg?semt=ais_hybrid&w=740&q=80",
    price: "$9.99",
    description: "A romantic novel of manners set in Georgian England.",
    tags: [
      { id: "t4", value: "docs" },
      { id: "t2", value: "fix" },
      { id: "t6", value: "mobile" },
    ],
  },
  {
    id: "b5",
    title: "The Catcher in the Rye",
    src: "https://img.freepik.com/free-photo/close-book-with-blue-cover_1101-92.jpg?semt=ais_hybrid&w=740&q=80",
    price: "$11.99",
    description:
      "A coming-of-age story following a teenage protagonist in New York.",
    tags: [
      { id: "t5", value: "internal" },
      { id: "t1", value: "feature" },
      { id: "t3", value: "bug" },
    ],
  },
  {
    id: "b6",
    title: "The Hobbit",
    src: "https://img.freepik.com/free-photo/close-book-with-blue-cover_1101-92.jpg?semt=ais_hybrid&w=740&q=80",
    price: "$14.99",
    description: "An epic fantasy adventure of a hobbit on a quest.",
    tags: [
      { id: "t6", value: "mobile" },
      { id: "t2", value: "fix" },
      { id: "t4", value: "docs" },
    ],
  },
  {
    id: "b7",
    title: "Jane Eyre",
    src: "https://img.freepik.com/free-photo/close-book-with-blue-cover_1101-92.jpg?semt=ais_hybrid&w=740&q=80",
    price: "$12.49",
    description: "A gothic romance with a strong female protagonist.",
    tags: [
      { id: "t1", value: "feature" },
      { id: "t3", value: "bug" },
      { id: "t5", value: "internal" },
    ],
  },
  {
    id: "b8",
    title: "Wuthering Heights",
    src: "https://img.freepik.com/free-photo/close-book-with-blue-cover_1101-92.jpg?semt=ais_hybrid&w=740&q=80",
    price: "$11.49",
    description: "A dark, passionate tale of love and revenge on the moors.",
    tags: [
      { id: "t2", value: "fix" },
      { id: "t4", value: "docs" },
      { id: "t6", value: "mobile" },
    ],
  },
  {
    id: "b9",
    title: "Brave New World",
    src: "https://img.freepik.com/free-photo/close-book-with-blue-cover_1101-92.jpg?semt=ais_hybrid&w=740&q=80",
    price: "$13.49",
    description: "A science fiction novel about a dystopian future society.",
    tags: [
      { id: "t3", value: "bug" },
      { id: "t1", value: "feature" },
      { id: "t2", value: "fix" },
    ],
  },
  {
    id: "b10",
    title: "The Lord of the Rings",
    src: "https://img.freepik.com/free-photo/close-book-with-blue-cover_1101-92.jpg?semt=ais_hybrid&w=740&q=80",
    price: "$24.99",
    description:
      "An epic fantasy trilogy following the quest to destroy the One Ring.",
    tags: [
      { id: "t4", value: "docs" },
      { id: "t5", value: "internal" },
      { id: "t1", value: "feature" },
    ],
  },
  {
    id: "b11",
    title: "Moby Dick",
    src: "https://img.freepik.com/free-photo/close-book-with-blue-cover_1101-92.jpg?semt=ais_hybrid&w=740&q=80",
    price: "$15.99",
    description:
      "An adventure novel about obsession and the pursuit of a white whale.",
    tags: [
      { id: "t5", value: "internal" },
      { id: "t2", value: "fix" },
      { id: "t6", value: "mobile" },
    ],
  },
  {
    id: "b12",
    title: "The Great Expectations",
    src: "https://img.freepik.com/free-photo/close-book-with-blue-cover_1101-92.jpg?semt=ais_hybrid&w=740&q=80",
    price: "$12.99",
    description:
      "A bildungsroman about a young orphan's rise in Victorian society.",
    tags: [
      { id: "t6", value: "mobile" },
      { id: "t3", value: "bug" },
      { id: "t4", value: "docs" },
    ],
  },
  {
    id: "b13",
    title: "The Picture of Dorian Gray",
    src: "https://img.freepik.com/free-photo/close-book-with-blue-cover_1101-92.jpg?semt=ais_hybrid&w=740&q=80",
    price: "$10.49",
    description:
      "A philosophical novel exploring beauty, morality, and corruption.",
    tags: [
      { id: "t1", value: "feature" },
      { id: "t5", value: "internal" },
      { id: "t3", value: "bug" },
    ],
  },
];
