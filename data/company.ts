import type { Company } from "./types";

/** Central business details. Values marked TODO are placeholders — swap for the
 *  real Vyntra details in this one file and they update everywhere. */
export const company: Company = {
  name: "Vyntra Property Services",
  legalName: "Vyntra Property Services Pty Ltd",
  tagline: "Premium Property Maintenance & Cleaning Solutions",

  phone: "+61451510026", // TODO: confirm real phone (E.164 for tel: links)
  phoneDisplay: "0451 510 026", // TODO: confirm real phone
  emergencyPhone: "+61451510026", // TODO: real after-hours line
  emergencyPhoneDisplay: "0451 510 026", // TODO

  email: "info@vyntrapropertyservices.com", // TODO: real inbox

  address: {
    street: "Level 12, 1 Sydney Avenue", // TODO: real address
    suburb: "Sydney",
    state: "NSW",
    postcode: "2000",
    country: "Australia",
  },

  abn: "69 252 402 831",

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
