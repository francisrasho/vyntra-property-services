export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  /** Present on before/after items (used by the gallery slider). */
  before?: string;
  after?: string;
}

/** Placeholder gallery imagery (picsum seeds). Swap for real Vyntra project
 *  photography before launch. */
export const galleryCategories = [
  "All",
  "Commercial",
  "Office",
  "Strata",
  "Pressure Washing",
  "End of Lease",
  "Maintenance",
] as const;

export const gallery: GalleryItem[] = [
  {
    id: "g1",
    title: "CBD office fit-out clean",
    category: "Office",
    image: "https://picsum.photos/seed/vyntra-g1/900/900",
  },
  {
    id: "g2",
    title: "Strata lobby restoration",
    category: "Strata",
    image: "https://picsum.photos/seed/vyntra-g2/900/900",
    before: "https://picsum.photos/seed/vyntra-g2-before/1200/800",
    after: "https://picsum.photos/seed/vyntra-g2-after/1200/800",
  },
  {
    id: "g3",
    title: "Car park pressure wash",
    category: "Pressure Washing",
    image: "https://picsum.photos/seed/vyntra-g3/900/900",
    before: "https://picsum.photos/seed/vyntra-g3-before/1200/800",
    after: "https://picsum.photos/seed/vyntra-g3-after/1200/800",
  },
  {
    id: "g4",
    title: "Retail showroom detail",
    category: "Commercial",
    image: "https://picsum.photos/seed/vyntra-g4/900/900",
  },
  {
    id: "g5",
    title: "End of lease handover",
    category: "End of Lease",
    image: "https://picsum.photos/seed/vyntra-g5/900/900",
    before: "https://picsum.photos/seed/vyntra-g5-before/1200/800",
    after: "https://picsum.photos/seed/vyntra-g5-after/1200/800",
  },
  {
    id: "g6",
    title: "Facade & entry maintenance",
    category: "Maintenance",
    image: "https://picsum.photos/seed/vyntra-g6/900/900",
  },
  {
    id: "g7",
    title: "Corporate floor nightly clean",
    category: "Office",
    image: "https://picsum.photos/seed/vyntra-g7/900/900",
  },
  {
    id: "g8",
    title: "Common-area deep clean",
    category: "Strata",
    image: "https://picsum.photos/seed/vyntra-g8/900/900",
  },
  {
    id: "g9",
    title: "Driveway restoration",
    category: "Pressure Washing",
    image: "https://picsum.photos/seed/vyntra-g9/900/900",
    before: "https://picsum.photos/seed/vyntra-g9-before/1200/800",
    after: "https://picsum.photos/seed/vyntra-g9-after/1200/800",
  },
  {
    id: "g10",
    title: "Medical suite sanitisation",
    category: "Commercial",
    image: "https://picsum.photos/seed/vyntra-g10/900/900",
  },
  {
    id: "g11",
    title: "Garden & grounds upkeep",
    category: "Maintenance",
    image: "https://picsum.photos/seed/vyntra-g11/900/900",
  },
  {
    id: "g12",
    title: "Vacated apartment turnaround",
    category: "End of Lease",
    image: "https://picsum.photos/seed/vyntra-g12/900/900",
  },
];
