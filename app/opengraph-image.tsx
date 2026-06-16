import { ImageResponse } from "next/og";

export const alt =
  "Vyntra Property Services — Premium Property Maintenance & Cleaning, Sydney";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background: "#0F172A",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 38,
            letterSpacing: 10,
            color: "#D4AF37",
            fontWeight: 700,
          }}
        >
          VYNTRA
        </div>
        <div
          style={{
            fontSize: 66,
            fontWeight: 800,
            marginTop: 28,
            maxWidth: 920,
            lineHeight: 1.08,
          }}
        >
          Sydney&apos;s Premium Property Services Partner
        </div>
        <div
          style={{
            fontSize: 28,
            marginTop: 28,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Cleaning · Maintenance · Strata · Commercial
        </div>
      </div>
    ),
    { ...size },
  );
}
