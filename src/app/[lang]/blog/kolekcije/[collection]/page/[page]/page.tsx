import { collectionListPage } from "../../../../_collections/routes";

// /sr/blog/kolekcije/<collection>/page/<n>; see _collections/routes.tsx
const route = collectionListPage("sr");

// Pages 2..N of each collection only; anything else is a 404
export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
