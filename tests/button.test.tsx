import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders a <button> with primary styles by default", () => {
    render(<Button>Get Quote</Button>);
    const btn = screen.getByRole("button", { name: "Get Quote" });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain("bg-gold");
    expect(btn).toHaveAttribute("type", "button");
  });

  it("renders an <a> link when href is provided", () => {
    render(<Button href="/contact">Contact us</Button>);
    const link = screen.getByRole("link", { name: "Contact us" });
    expect(link).toHaveAttribute("href", "/contact");
  });

  it("applies the secondary variant styles", () => {
    render(<Button variant="secondary">Book</Button>);
    expect(screen.getByRole("button", { name: "Book" }).className).toContain(
      "bg-ink",
    );
  });

  it("renders an external link with safe rel attributes", () => {
    render(
      <Button href="tel:+61000" external>
        Call
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Call" });
    expect(link).toHaveAttribute("href", "tel:+61000");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
