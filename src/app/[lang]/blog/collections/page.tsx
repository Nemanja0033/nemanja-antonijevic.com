import { collectionsIndex } from "../_collections/routes";

// /en/blog/collections; see _collections/routes.tsx
const route = collectionsIndex("en");

export const generateMetadata = route.generateMetadata;
export default route.Page;
