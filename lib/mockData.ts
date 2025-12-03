import { Tag } from "./types";
import { Book } from "./types";

export const tags: Tag[] = [
  { id: "t1", value: "Classic", icon: "BookMarked" },
  { id: "t2", value: "Jazz Age", icon: "Music" },
  { id: "t3", value: "American Dream", icon: "Flag" },
  { id: "t4", value: "Social Justice", icon: "Scale" },
  { id: "t5", value: "Coming of Age", icon: "Sprout" },
  { id: "t6", value: "Southern Gothic", icon: "Church" },
  { id: "t7", value: "Dystopian", icon: "AlertTriangle" },
  { id: "t8", value: "Surveillance", icon: "Eye" },
  { id: "t9", value: "Political Fiction", icon: "Landmark" },
  { id: "t10", value: "Romance", icon: "Heart" },
  { id: "t11", value: "Regency Era", icon: "Crown" },
  { id: "t12", value: "Social Commentary", icon: "MessageCircle" },
  { id: "t13", value: "Young Adult", icon: "Users" },
  { id: "t14", value: "Contemporary Fiction", icon: "Clock" },
  { id: "t15", value: "Fantasy", icon: "Sparkles" },
  { id: "t16", value: "Adventure", icon: "Compass" },
  { id: "t17", value: "Middle-earth", icon: "Mountain" },
  { id: "t18", value: "Gothic Romance", icon: "Moon" },
  { id: "t19", value: "Victorian", icon: "Home" },
  { id: "t20", value: "Feminism", icon: "Flame" },
  { id: "t21", value: "Gothic", icon: "CloudMoon" },
  { id: "t22", value: "Tragic Romance", icon: "HeartCrack" },
  { id: "t23", value: "British Literature", icon: "Book" },
  { id: "t24", value: "Science Fiction", icon: "Rocket" },
  { id: "t25", value: "Philosophy", icon: "Lightbulb" },
  { id: "t26", value: "Epic Fantasy", icon: "Sword" },
  { id: "t27", value: "High Fantasy", icon: "Castle" },
  { id: "t28", value: "Maritime", icon: "Anchor" },
  { id: "t29", value: "Bildungsroman", icon: "TrendingUp" },
];

export const RecommendedBooks: Book[] = [
  {
    id: "b1",
    title: "The Great Gatsby",
    src: "https://m.media-amazon.com/images/I/81TLiZrasVL.jpg",
    price: "$12.99",
    rating: 4.5,
    description:
      "A classic American novel about wealth and love in the Jazz Age.",
    longDescription:
      "F. Scott Fitzgerald's masterpiece captures the essence of the American Dream during the Roaring Twenties, following the mysterious millionaire Jay Gatsby and his obsessive love for the beautiful Daisy Buchanan. Through lavish parties and complex relationships, the novel explores themes of wealth, class, and the corruption of the American Dream.",
    tags: [
      { id: "t1", value: "Classic" },
      { id: "t2", value: "Jazz Age" },
      { id: "t3", value: "American Dream" },
    ],
  },
  {
    id: "b2",
    title: "To Kill a Mockingbird",
    src: "https://m.media-amazon.com/images/I/91REf0GGuiL._UF1000,1000_QL80_.jpg",
    price: "$10.99",
    rating: 4.8,
    description: "A gripping tale of racial injustice and childhood innocence.",
    longDescription:
      "Harper Lee's powerful narrative set in the Depression-era South follows young Scout Finch as her father defends a Black man falsely accused of rape. The novel addresses prejudice, moral growth, and the loss of innocence through the eyes of a curious child.",
    tags: [
      { id: "t4", value: "Social Justice" },
      { id: "t5", value: "Coming of Age" },
      { id: "t6", value: "Southern Gothic" },
    ],
  },
  {
    id: "b3",
    title: "1984",
    src: "https://m.media-amazon.com/images/I/71wANojhEKL._AC_UF894,1000_QL80_.jpg",
    price: "$13.99",
    rating: 4.6,
    description:
      "A dystopian novel exploring totalitarianism and surveillance.",
    longDescription:
      "George Orwell's chilling dystopia presents a totalitarian society where Big Brother watches everyone. Through the eyes of protagonist Winston Smith, readers experience systematic oppression, propaganda, and the manipulation of truth in a nightmarish world of constant surveillance and control.",
    tags: [
      { id: "t7", value: "Dystopian" },
      { id: "t8", value: "Surveillance" },
      { id: "t9", value: "Political Fiction" },
    ],
  },
  {
    id: "b4",
    title: "Pride and Prejudice",
    src: "https://m.media-amazon.com/images/I/712P0p5cXIL._AC_UF894,1000_QL80_.jpg",
    price: "$9.99",
    rating: 4.7,
    description: "A romantic novel of manners set in Georgian England.",
    longDescription:
      "Jane Austen's witty romantic comedy follows Elizabeth Bennet as she navigates societal expectations and her own prejudices. Her relationship with the proud Mr. Darcy becomes a journey of mutual understanding, challenging assumptions about social class, character, and love.",
    tags: [
      { id: "t10", value: "Romance" },
      { id: "t11", value: "Regency Era" },
      { id: "t12", value: "Social Commentary" },
    ],
  },
  {
    id: "b5",
    title: "The Catcher in the Rye",
    src: "https://m.media-amazon.com/images/I/91fQEUwFMyL.jpg",
    price: "$11.99",
    rating: 4.2,
    description:
      "A coming-of-age story following a teenage protagonist in New York.",
    longDescription:
      "J.D. Salinger's controversial novel follows Holden Caulfield's emotional journey through New York City as he processes his expulsion from boarding school. With raw emotion and distinctive voice, Holden explores alienation, loss of innocence, and the search for authenticity in a world he views as superficial.",
    tags: [
      { id: "t5", value: "Coming of Age" },
      { id: "t13", value: "Young Adult" },
      { id: "t14", value: "Contemporary Fiction" },
    ],
  },
  {
    id: "b6",
    title: "The Hobbit",
    src: "https://m.media-amazon.com/images/I/91ZX8zNpwZL._UF1000,1000_QL80_.jpg",
    price: "$14.99",
    rating: 4.7,
    description: "An epic fantasy adventure of a hobbit on a quest.",
    longDescription:
      "J.R.R. Tolkien's beloved fantasy follows Bilbo Baggins, a reluctant hobbit who joins a company of dwarves on a treasure hunt. Facing dragons, elves, and trolls, Bilbo discovers courage and wisdom within himself while helping his companions reclaim their lost gold in the magical world of Middle-earth.",
    tags: [
      { id: "t15", value: "Fantasy" },
      { id: "t16", value: "Adventure" },
      { id: "t17", value: "Middle-earth" },
    ],
  },
  {
    id: "b7",
    title: "Jane Eyre",
    src: "https://m.media-amazon.com/images/I/61FQED7br6L._AC_UF894,1000_QL80_.jpg",
    price: "$12.49",
    rating: 4.6,
    description: "A gothic romance with a strong female protagonist.",
    longDescription:
      "Charlotte Brontë's gothic romance tells the story of orphaned Jane Eyre, a governess who overcomes hardship and finds love with the mysterious Mr. Rochester. Challenging Victorian conventions, the novel celebrates female independence, inner strength, and the pursuit of equality in love.",
    tags: [
      { id: "t18", value: "Gothic Romance" },
      { id: "t19", value: "Victorian" },
      { id: "t20", value: "Feminism" },
    ],
  },
  {
    id: "b8",
    title: "Wuthering Heights",
    src: "https://m.media-amazon.com/images/I/51wJZQv6tML._AC_UF894,1000_QL80_.jpg",
    price: "$11.49",
    rating: 4.4,
    description: "A dark, passionate tale of love and revenge on the moors.",
    longDescription:
      "Emily Brontë's intense gothic novel explores destructive passion and revenge across generations on the Yorkshire moors. Through the turbulent relationship between Heathcliff and Catherine, the narrative reveals how love can become corrupted by social class, pride, and the desire for vengeance.",
    tags: [
      { id: "t21", value: "Gothic" },
      { id: "t22", value: "Tragic Romance" },
      { id: "t23", value: "British Literature" },
    ],
  },
  {
    id: "b9",
    title: "Brave New World",
    src: "https://m.media-amazon.com/images/I/81fiJzvcB2L._UF1000,1000_QL80_.jpg",
    price: "$13.49",
    rating: 4.5,
    description: "A science fiction novel about a dystopian future society.",
    longDescription:
      "Aldous Huxley's prophetic dystopia depicts a future where conditioning, drugs, and consumerism maintain social control and happiness. Through the experiences of protagonist Bernard Marx, the novel questions the cost of stability and explores what it means to be truly human in a world of manufactured contentment.",
    tags: [
      { id: "t24", value: "Science Fiction" },
      { id: "t7", value: "Dystopian" },
      { id: "t25", value: "Philosophy" },
    ],
  },
  {
    id: "b10",
    title: "The Lord of the Rings",
    src: "https://img.freepik.com/free-photo/close-book-with-blue-cover_1101-92.jpg?semt=ais_hybrid&w=740&q=80",
    price: "$24.99",
    rating: 4.9,
    description:
      "An epic fantasy trilogy following the quest to destroy the One Ring.",
    longDescription:
      "J.R.R. Tolkien's monumental fantasy epic follows Frodo Baggins and the Fellowship on a perilous journey to destroy the One Ring and defeat the dark lord Sauron. Across vast landscapes and through countless trials, themes of friendship, sacrifice, and the battle between good and evil create one of literature's greatest adventures.",
    tags: [
      { id: "t26", value: "Epic Fantasy" },
      { id: "t16", value: "Adventure" },
      { id: "t27", value: "High Fantasy" },
    ],
  },
  {
    id: "b11",
    title: "Moby Dick",
    src: "https://img.freepik.com/free-photo/close-book-with-blue-cover_1101-92.jpg?semt=ais_hybrid&w=740&q=80",
    price: "$15.99",
    rating: 4.3,
    description:
      "An adventure novel about obsession and the pursuit of a white whale.",
    longDescription:
      "Herman Melville's sprawling maritime epic follows Captain Ahab's obsessive quest to hunt the legendary white whale, Moby Dick, aboard the whaling ship Pequod. A meditation on obsession, nature, and humanity's place in the universe, the novel combines adventure with philosophical depth and unforgettable characters.",
    tags: [
      { id: "t28", value: "Maritime" },
      { id: "t16", value: "Adventure" },
      { id: "t25", value: "Philosophy" },
    ],
  },
  {
    id: "b12",
    title: "The Great Expectations",
    src: "https://img.freepik.com/free-photo/close-book-with-blue-cover_1101-92.jpg?semt=ais_hybrid&w=740&q=80",
    price: "$12.99",
    rating: 1.5,
    description:
      "A bildungsroman about a young orphan's rise in Victorian society.",
    longDescription:
      "Charles Dickens' coming-of-age novel follows Pip from his humble village beginnings to his transformation into a gentleman in London. Through his journey, Pip learns valuable lessons about loyalty, ambition, and the true meaning of being a gentleman, ultimately discovering that inner character matters more than social status.",
    tags: [
      { id: "t19", value: "Victorian" },
      { id: "t5", value: "Coming of Age" },
      { id: "t29", value: "Bildungsroman" },
    ],
  },
  {
    id: "b13",
    title: "The Picture of Dorian Gray",
    src: "https://img.freepik.com/free-photo/close-book-with-blue-cover_1101-92.jpg?semt=ais_hybrid&w=740&q=80",
    price: "$10.49",
    rating: 4.4,
    description:
      "A philosophical novel exploring beauty, morality, and corruption.",
    longDescription:
      "Oscar Wilde's philosophical novella follows the beautiful Dorian Gray, who remains eternally young while a portrait ages in his place, absorbing the consequences of his morally corrupt lifestyle. A meditation on aestheticism, vanity, and the corruption of the soul, the novel questions the relationship between beauty and morality.",
    tags: [
      { id: "t21", value: "Gothic" },
      { id: "t19", value: "Victorian" },
      { id: "t25", value: "Philosophy" },
    ],
  },
];
