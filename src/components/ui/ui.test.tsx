import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button, Card, Chip, cx, FloatingBubble, IconBubble, Pill } from "./index";

describe("cx", () => {
  it("joins class names and skips empty ones", () => {
    expect(cx("a", false, null, undefined, "", "b")).toBe("a b");
  });
});

describe("Pill", () => {
  it("renders its content as a non-interactive label", () => {
    render(<Pill>3 min read</Pill>);
    const pill = screen.getByText("3 min read");
    expect(pill.tagName).toBe("SPAN");
  });
});

describe("Chip", () => {
  it("is a link to its href", () => {
    render(<Chip href="/en/blog/tags/css">css</Chip>);
    expect(screen.getByRole("link", { name: "css" })).toHaveAttribute("href", "/en/blog/tags/css");
  });

  it("marks the current page with aria-current only when active", () => {
    render(
      <>
        <Chip href="/en/blog" variant="filter" active>
          all
        </Chip>
        <Chip href="/en/blog/tags/css" variant="filter">
          css
        </Chip>
      </>,
    );
    expect(screen.getByRole("link", { name: "all" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "css" })).not.toHaveAttribute("aria-current");
  });
});

describe("Button", () => {
  it("is a link when it has an href", () => {
    render(
      <Button href="/sr/blog/page/2" rel="next">
        older →
      </Button>,
    );
    const link = screen.getByRole("link", { name: "older →" });
    expect(link).toHaveAttribute("href", "/sr/blog/page/2");
    expect(link).toHaveAttribute("rel", "next");
  });

  it("without an href is an inert element hidden from assistive tech", () => {
    render(<Button variant="muted">← newer</Button>);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("← newer")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("Card", () => {
  it("renders the requested element", () => {
    const { container } = render(<Card as="aside">sidebar</Card>);
    expect(container.querySelector("aside")).toHaveTextContent("sidebar");
  });

  it("becomes a link when it has an href", () => {
    render(<Card href="/en/blog/test">Markdown showcase</Card>);
    expect(screen.getByRole("link", { name: "Markdown showcase" })).toHaveAttribute(
      "href",
      "/en/blog/test",
    );
  });

  it("passes the caller's className through", () => {
    const { container } = render(<Card className="layout">x</Card>);
    expect(container.firstElementChild).toHaveClass("layout");
  });
});

describe("IconBubble", () => {
  it("is a link named by its label", () => {
    render(
      <IconBubble href="mailto:hi@example.com" label="Send an email">
        <svg aria-hidden="true" />
      </IconBubble>,
    );
    const link = screen.getByRole("link", { name: "Send an email" });
    expect(link).toHaveAttribute("href", "mailto:hi@example.com");
    expect(link).not.toHaveAttribute("target");
  });

  it("opens external links in a new tab safely", () => {
    render(
      <IconBubble href="https://linkedin.com/in/x" label="LinkedIn" external>
        <svg aria-hidden="true" />
      </IconBubble>,
    );
    const link = screen.getByRole("link", { name: "LinkedIn" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});

describe("FloatingBubble", () => {
  it("is decoration hidden from screen readers by default", () => {
    const { container } = render(<FloatingBubble />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("is an image with a name when labelled", () => {
    render(<FloatingBubble label="Next.js logo" />);
    expect(screen.getByRole("img", { name: "Next.js logo" })).toBeInTheDocument();
  });

  it("passes size, color, opacity and duration as CSS custom properties", () => {
    const { container } = render(
      <FloatingBubble size={72} color="#ff7a59" opacity={1} duration={8} />,
    );
    const style = (container.firstElementChild as HTMLElement).style;
    expect(style.getPropertyValue("--bubble-size")).toBe("72px");
    expect(style.getPropertyValue("--bubble-color")).toBe("#ff7a59");
    expect(style.getPropertyValue("--bubble-opacity")).toBe("1");
    expect(style.getPropertyValue("--bubble-duration")).toBe("8s");
  });

  it("accepts any CSS length for size and renders its content", () => {
    const { container } = render(
      <FloatingBubble size="clamp(36px, 5vw, 64px)">
        <svg data-testid="icon" aria-hidden="true" />
      </FloatingBubble>,
    );
    expect((container.firstElementChild as HTMLElement).style.getPropertyValue("--bubble-size")).toBe(
      "clamp(36px, 5vw, 64px)",
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
