import { collectionPage } from "../../_collections/routes";

// /sr/blog/kolekcije/<collection>; see _collections/routes.tsx
const route = collectionPage("sr");

// Only collections with posts in this language exist; anything else is a 404
export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
