import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path: string | undefined | null) {
  if (!path) return undefined;

  // Handle case where path might be an object with url property (common in some backends)
  // @ts-ignore
  if (typeof path === 'object' && path.url) {
    // @ts-ignore
    path = path.url;
  }

  if (typeof path !== 'string') {
    console.warn("getImageUrl received non-string path:", path);
    return undefined;
  }

  if (path.startsWith("http") || path.startsWith("https") || path.startsWith("data:")) {
    return path;
  }

  // Handle local file paths (Windows/Unix)
  // If the path contains 'uploads', extraction the part from 'uploads' onwards
  let cleanPath = path;
  if (path.includes('uploads')) {
    const parts = path.split(/[/\\]/); // Split by / or \
    const uploadsIndex = parts.indexOf('uploads');
    if (uploadsIndex !== -1) {
      cleanPath = parts.slice(uploadsIndex).join('/');
    }
  }

  // Ensure no leading slash for the relative path part to avoid //
  cleanPath = cleanPath.startsWith("/") || cleanPath.startsWith("\\") ? cleanPath.slice(1) : cleanPath;

  // Replace all backslashes with forward slashes for URL compatibility
  cleanPath = cleanPath.replace(/\\/g, '/');

  return `http://localhost:5000/${cleanPath}`;
}
