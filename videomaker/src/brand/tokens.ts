/**
 * Brand kit tokens — swap via inputProps.brand without touching motion code.
 */
export type BrandTokens = {
  name: string;
  logoSrc: string;
  colors: {
    background: string;
    backgroundAccent: string;
    surface: string;
    surfaceMuted: string;
    text: string;
    textMuted: string;
    accent: string;
    success: string;
    columnHeader: string;
    shadow: string;
  };
  typography: {
    fontFamily: string;
    fontFile: string;
  };
  radii: {
    card: number;
    column: number;
    badge: number;
    button: number;
  };
  shadows: {
    card: string;
    cardLifted: string;
    board: string;
  };
};

export const defaultBrand: BrandTokens = {
  name: "Fluxo",
  logoSrc: "brand/logo.svg",
  colors: {
    background: "#0D7377",
    backgroundAccent: "#095E61",
    surface: "#FFFFFF",
    surfaceMuted: "#F3F7F7",
    text: "#14212B",
    textMuted: "#5B6B75",
    accent: "#FF6B35",
    success: "#22A06B",
    columnHeader: "#0B5F63",
    shadow: "rgba(8, 40, 44, 0.28)",
  },
  typography: {
    fontFamily: "Plus Jakarta Sans",
    fontFile: "fonts/PlusJakartaSans.ttf",
  },
  radii: {
    card: 16,
    column: 20,
    badge: 999,
    button: 14,
  },
  shadows: {
    card: "0 8px 20px rgba(8, 40, 44, 0.12)",
    cardLifted: "0 28px 48px rgba(8, 40, 44, 0.32)",
    board: "0 24px 60px rgba(8, 40, 44, 0.28)",
  },
};
