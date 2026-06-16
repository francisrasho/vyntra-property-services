import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";

describe("BeforeAfterSlider", () => {
  it("renders a slider defaulting to 50%", () => {
    render(<BeforeAfterSlider before="/b.jpg" after="/a.jpg" alt="Job" />);
    const slider = screen.getByRole("slider") as HTMLInputElement;
    expect(slider.value).toBe("50");
  });

  it("updates the reveal position on change", () => {
    render(<BeforeAfterSlider before="/b.jpg" after="/a.jpg" alt="Job" />);
    const slider = screen.getByRole("slider") as HTMLInputElement;
    fireEvent.change(slider, { target: { value: "80" } });
    expect(slider.value).toBe("80");
  });

  it("constrains the range to 0–100", () => {
    render(<BeforeAfterSlider before="/b.jpg" after="/a.jpg" alt="Job" />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "100");
  });
});
