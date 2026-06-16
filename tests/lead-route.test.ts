import { describe, it, expect, beforeEach, vi } from "vitest";

const insertMock = vi.fn((_row: Record<string, unknown>) =>
  Promise.resolve({ error: null }),
);
const fromMock = vi.fn((_table: string) => ({ insert: insertMock }));

vi.mock("@/lib/supabase", () => ({
  getServiceClient: () => ({ from: fromMock }),
}));

import { POST } from "@/app/api/lead/route";

function req(body: unknown) {
  return new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const valid = {
  source: "contact_form",
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "0400 000 000",
};

describe("POST /api/lead", () => {
  beforeEach(() => {
    insertMock.mockClear();
    fromMock.mockClear();
    process.env.LEAD_SINK = "log";
  });

  it("accepts a valid lead in demo (log) mode", async () => {
    const res = await POST(req(valid));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid lead with 400", async () => {
    const res = await POST(req({ source: "contact_form", email: "nope" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  it("silently accepts (and drops) when the honeypot is filled", async () => {
    const res = await POST(req({ ...valid, company_website: "spam-bot" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("inserts mapped columns into supabase when LEAD_SINK=supabase", async () => {
    process.env.LEAD_SINK = "supabase";
    const res = await POST(
      req({
        ...valid,
        propertyType: "office",
        preferredContact: "email",
        estimateLow: 100,
        estimateHigh: 200,
      }),
    );
    expect(res.status).toBe(200);
    expect(fromMock).toHaveBeenCalledWith("website_leads");
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(insertMock.mock.calls[0][0]).toMatchObject({
      name: "Jane Doe",
      property_type: "office",
      preferred_contact: "email",
      estimate_low: 100,
      estimate_high: 200,
    });
  });
});
