// src/shims-google.d.ts

export {};

declare global {
  interface Window {
    google: any;
  }

  const google: any;
}