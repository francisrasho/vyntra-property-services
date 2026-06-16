import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

describe("AnimatedCounter", () => {
  it("counts up to the target value once in view", async () => {
    render(<AnimatedCounter value={500} suffix="+" duration={40} />);
    await waitFor(
      () => expect(screen.getByText("500+")).toBeInTheDocument(),
      { timeout: 2000 },
    );
  });

  it("formats decimals and renders the suffix", async () => {
    render(<AnimatedCounter value={98} suffix="%" duration={40} />);
    await waitFor(() => expect(screen.getByText("98%")).toBeInTheDocument(), {
      timeout: 2000,
    });
  });
});
