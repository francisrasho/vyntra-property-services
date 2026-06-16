import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { QuoteForm } from "@/components/forms/QuoteForm";

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => vi.unstubAllGlobals());

describe("QuoteForm", () => {
  it("does not advance past step 1 until a service is selected", async () => {
    const user = userEvent.setup();
    render(<QuoteForm />);

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(
      await screen.findByText(/select at least one service/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/what type of property/i)).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("submits a complete multi-step quote", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(<QuoteForm onSuccess={onSuccess} />);

    // Step 1 — services
    await user.click(screen.getByRole("button", { name: "Commercial Cleaning" }));
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Step 2 — property
    await user.click(await screen.findByRole("button", { name: "Commercial" }));
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Step 3 — details
    await user.type(await screen.findByLabelText(/suburb/i), "Chatswood");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Step 4 — contact
    await user.type(await screen.findByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/phone/i), "0400000000");
    await user.type(screen.getByLabelText(/email/i), "jane@example.com");
    await user.click(screen.getByRole("button", { name: /get my free quote/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(init.body as string);
    expect(body.source).toBe("quote_form");
    expect(body.service).toContain("Commercial Cleaning");
    expect(body.propertyType).toBe("commercial");
    expect(body.suburb).toBe("Chatswood");
    expect(body.name).toBe("Jane Doe");

    expect(await screen.findByText(/request received/i)).toBeInTheDocument();
    expect(onSuccess).toHaveBeenCalled();
  });
});
