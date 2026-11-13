import { collectionsIndex } from "../_collections/routes";

// /sr/blog/kolekcije; see _collections/routes.tsx
const route = collectionsIndex("sr");

export const generateMetadata = route.generateMetadata;
export default route.Page;
