// src/utils/flags.ts
export function flagUrl(code: string, width = 80): string {
  return `https://flagcdn.com/w${width}/${code.toLowerCase()}.png`;
}

export function flagImg(code: string, size = 16): string {
  const url = flagUrl(code, size * 2);
  return `<img src="${url}" alt="${code}" style="height:${size}px;vertical-align:middle;border-radius:2px" />`;
}
