export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function extractErrorMessage(
  errorData: unknown,
  fallback: string,
): string {
  if (
    typeof errorData === "object" &&
    errorData !== null &&
    "detail" in errorData
  ) {
    const detail = (errorData as { detail: unknown }).detail;
    if (typeof detail == "string") return detail;
  }

  return fallback;
}

export function authHeader(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}
