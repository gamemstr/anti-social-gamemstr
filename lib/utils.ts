import type { User } from "@supabase/supabase-js";
import { clsx, type ClassValue } from "clsx";
import { JwtPayload } from "jwt-decode";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CustomSupabaseJwtPayload = JwtPayload & { user_role?: string };

export type CustomUser = User & {
  appRole?: string;
};