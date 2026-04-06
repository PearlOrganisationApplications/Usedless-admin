"use client";

export interface TokenPair {
  token: string;
}

export const getTokens = async (): Promise<TokenPair | null> => {
  if (typeof window === "undefined") return null;

  // Read the correct token saved during login
  const token = localStorage.getItem("access_token");

  if (!token) return null;

  return { token };
};

export const storeTokens = async (data: TokenPair): Promise<void> => {
  if (typeof window === "undefined") return;

  localStorage.setItem("access_token", data.token);
};
