import type { Company } from "./types";

/** Central business details. Values marked TODO are placeholders — swap for the
 *  real Vyntra details in this one file and they update everywhere. */
export const company: Company = {
  name: "Vyntra Property Services",
  legalName: "Vyntra Property Services Pty Ltd",
  tagline: "Premium Property Maintenance & Cleaning Solutions",

  phone: "+61255500000", // TODO: real phone (E.164)
  phoneDisplay: "(02) 5550 0000", // TODO: real phone
  emergencyPhone: "+61255500911", // TODO: real after-hours line
  emergencyPhoneDisplay: "(02) 5550 0911", // TODO

  email: "hello@vyntra.com.au", // TODO: real inbox

  address: {
    street: "Level 12, 1 Sydney Avenue", // TODO: real address
    suburb: "Sydney",
    state: "NSW",
    postcode: "2000",
    country: "Australia",
  },

  abn: "00 000 000 000", // TODO: real ABN

  hours: [
    { days: "Monday – Friday", time: "7:00am – 6:00pm" },
    { days: "Saturday", time: "8:00am – 4:00pm" },
    { days: "Sunday", time: "Emergency support only" },
    { days: "Emergencies", time: "24 / 7" },
  ],

  socials: [
    { label: "LinkedIn", href: "#" }, // TODO: real profiles
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
  ],
};
