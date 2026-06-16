import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and de-duplicate Tailwind utilities. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
