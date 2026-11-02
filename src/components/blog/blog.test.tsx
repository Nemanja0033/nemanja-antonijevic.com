import { render, screen, within } from "@testing-library/react";
import type { StaticImageData } from "next/image";
import { describe, expect, it } from "vitest";
import type { PostSummary } from "@/lib/posts";
import { LatestPosts } from "./latest-posts";
import { Pagination } from "./pagination";
import { PostCard } from "./post-card";
import { PostList } from "./post-list";
import { TagFilter } from "./tag-filter";
import { TagList } from "./tag-list";

const cover: StaticImageData = { src: "/cover.jpg", width: 1600, height: 900, blurDataURL: "data:," };

const post = (overrides: Partial<PostSummary> = {}): PostSummary => ({
  slug: "test",
  title: "Markdown showcase",
  description: "An example post.",
  date: "2026-10-09",
  tags: ["mdx", "css"],
  cover,
  readingMinutes: 3,
  ...overrides,
});

describe("TagList", () => {
  it("links every tag to its tag page in the given language", () => {
    render(<TagList lang="sr" tags={["mdx", "css"]} />);
    expect(screen.getByRole("link", { name: "mdx" })).toHaveAttribute("href", "/sr/blog/tags/mdx");
    expect(screen.getByRole("link", { name: "css" })).toHaveAttribute("href", "/sr/blog/tags/css");
  });

  it("renders nothing without tags", () => {
    const { container } = render(<TagList lang="en" tags={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("TagFilter", () => {
  it('starts with "all" and marks the active tag', () => {
    render(<TagFilter lang="en" tags={["mdx", "css"]} active="css" />);
    const nav = screen.getByRole("navigation", { name: "Filter by tag" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((l) => l.textContent)).toEqual(["all", "mdx", "css"]);
    expect(within(nav).getByRole("link", { name: "css" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "all" })).not.toHaveAttribute("aria-current");
  });

  it('marks "all" on the main blog list', () => {
    render(<TagFilter lang="sr" tags={["mdx"]} />);
    expect(screen.getByRole("link", { name: "sve" })).toHaveAttribute("aria-current", "page");
  });
});

describe("Pagination", () => {
  it("renders nothing for a single page", () => {
    const { container } = render(<Pagination lang="en" page={1} totalPages={1} basePath="/blog" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("on page 1 links only to older posts", () => {
    render(<Pagination lang="en" page={1} totalPages={3} basePath="/blog" />);
    expect(screen.getByRole("link", { name: "older →" })).toHaveAttribute("href", "/en/blog/page/2");
    expect(screen.queryByRole("link", { name: "← newer" })).toBeNull();
    expect(screen.getByText("page 1 / 3")).toBeInTheDocument();
  });

  it("links page 2 back to the list's own URL, not /page/1", () => {
    render(<Pagination lang="sr" page={2} totalPages={2} basePath="/blog/tags/css" />);
    expect(screen.getByRole("link", { name: "← novije" })).toHaveAttribute("href", "/sr/blog/tags/css");
    expect(screen.queryByRole("link", { name: "starije →" })).toBeNull();
  });
});

describe("PostCard", () => {
  it("shows date, reading time, title link, description, tags and URL", () => {
    render(<PostCard lang="en" post={post()} />);
    const card = screen.getByRole("article");
    expect(within(card).getByText("Oct 9, 2026").closest("time")).toHaveAttribute("dateTime", "2026-10-09");
    expect(within(card).getByText("3 min read")).toBeInTheDocument();
    expect(within(card).getByRole("link", { name: "Markdown showcase" })).toHaveAttribute(
      "href",
      "/en/blog/test",
    );
    expect(within(card).getByText("An example post.")).toBeInTheDocument();
    expect(within(card).getByRole("link", { name: "mdx" })).toBeInTheDocument();
    expect(within(card).getByText("/en/blog/test")).toBeInTheDocument();
  });

  it("uses the Serbian texts and date format", () => {
    render(<PostCard lang="sr" post={post()} />);
    expect(screen.getByText("9. okt 2026")).toBeInTheDocument();
    expect(screen.getByText("3 min čitanja")).toBeInTheDocument();
  });

  it("leaves out a missing description", () => {
    render(<PostCard lang="en" post={post({ description: undefined })} />);
    expect(screen.queryByText("An example post.")).toBeNull();
  });

  it("treats the cover as decoration (empty alt)", () => {
    const { container } = render(<PostCard lang="en" post={post()} />);
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
  });
});

describe("PostList", () => {
  it("renders one card per post, in order", () => {
    render(<PostList lang="en" posts={[post({ slug: "a", title: "A" }), post({ slug: "b", title: "B" })]} />);
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual(["A", "B"]);
  });
});

describe("LatestPosts", () => {
  it("lists titles as links with descriptions, then a link to all posts", () => {
    render(<LatestPosts lang="en" posts={[post(), post({ slug: "x", title: "X", description: undefined })]} />);
    const section = screen.getByRole("region", { name: "Latest posts" });
    expect(within(section).getByRole("link", { name: "Markdown showcase" })).toHaveAttribute(
      "href",
      "/en/blog/test",
    );
    expect(within(section).getByText("An example post.")).toBeInTheDocument();
    expect(within(section).getByRole("link", { name: "All posts →" })).toHaveAttribute("href", "/en/blog");
  });

  it("renders nothing without posts", () => {
    const { container } = render(<LatestPosts lang="sr" posts={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
