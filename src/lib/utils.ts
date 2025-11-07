import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { keccak256, toUtf8Bytes } from "ethers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildDataHash(input: any, salt = ""): string {
  const raw = typeof input === "string" ? input : JSON.stringify(input);
  return keccak256(toUtf8Bytes(`${raw}:${salt}`));
}
