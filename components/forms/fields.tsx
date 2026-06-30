"use client";

import { useFormContext, type RegisterOptions } from "react-hook-form";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export const inputBase =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink-400 focus:border-brass focus:ring-2 focus:ring-brass/30";

function FieldShell({
  name,
  label,
  required,
  className,
  children,
}: {
  name: string;
  label: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const {
    formState: { errors },
  } = useFormContext();
  const err = errors[name]?.message as string | undefined;
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-brass"> *</span>}
      </span>
      {children}
      {err && <span className="mt-1 block text-xs text-red-500">{err}</span>}
    </label>
  );
}

interface CommonProps {
  name: string;
  label: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
  rules?: RegisterOptions;
}

export function TextField({
  name,
  label,
  type = "text",
  required,
  className,
  placeholder,
  autoComplete,
  rules,
}: CommonProps & { type?: string; autoComplete?: string }) {
  const { register, formState } = useFormContext();
  const invalid = !!formState.errors[name];
  return (
    <FieldShell name={name} label={label} required={required} className={className}>
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={invalid}
        className={cn(inputBase, invalid && "border-red-400 focus:border-red-400 focus:ring-red-200")}
        {...register(name, rules)}
      />
    </FieldShell>
  );
}

export function TextareaField({
  name,
  label,
  required,
  className,
  placeholder,
  rows = 4,
  rules,
}: CommonProps & { rows?: number }) {
  const { register, formState } = useFormContext();
  const invalid = !!formState.errors[name];
  return (
    <FieldShell name={name} label={label} required={required} className={className}>
      <textarea
        rows={rows}
        placeholder={placeholder}
        aria-invalid={invalid}
        className={cn(inputBase, "resize-none", invalid && "border-red-400")}
        {...register(name, rules)}
      />
    </FieldShell>
  );
}

export function SelectField({
  name,
  label,
  required,
  className,
  options,
  placeholder = "Please select…",
  rules,
}: CommonProps & { options: { value: string; label: string }[] }) {
  const { register, formState } = useFormContext();
  const invalid = !!formState.errors[name];
  return (
    <FieldShell name={name} label={label} required={required} className={className}>
      <select
        aria-invalid={invalid}
        defaultValue=""
        className={cn(inputBase, "appearance-none", invalid && "border-red-400")}
        {...register(name, rules)}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

/** A selectable card/pill used for single-choice steps (property type, etc). */
export function Choice({
  selected,
  onClick,
  children,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-xl border px-4 py-3 text-sm font-medium transition-all",
        selected
          ? "border-graphite bg-graphite/[0.04] text-ink shadow-[0_0_0_1px_var(--color-graphite)]"
          : "border-line bg-paper text-ink-600 hover:border-graphite/40 hover:text-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}
