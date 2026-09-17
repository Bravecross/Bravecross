import { defaultBrand, type BrandTokens } from "../brand/tokens";

export type PipelineColumn = {
  id: string;
  title: string;
};

export type DealCardData = {
  id: string;
  title: string;
  value: string;
  company: string;
  /** Column index where the card starts */
  fromColumn: number;
  /** Column index where the card is dropped */
  toColumn: number;
};

export type ProductDemoProps = {
  brand: BrandTokens;
  headline: string;
  ctaLabel: string;
  columns: PipelineColumn[];
  deal: DealCardData;
  staticCards: Array<{
    id: string;
    title: string;
    value: string;
    column: number;
  }>;
  showAudio: boolean;
};

export const defaultProductDemoProps: ProductDemoProps = {
  brand: defaultBrand,
  headline: "Organize seu pipeline em segundos",
  ctaLabel: "Teste grátis",
  columns: [
    {id: "lead", title: "Qualificação"},
    {id: "proposta", title: "Proposta feita"},
    {id: "ganho", title: "Ganho"},
  ],
  deal: {
    id: "deal-hero",
    title: "Negócio Casa Rio",
    value: "R$ 15.000",
    company: "Casa Rio Ltda",
    fromColumn: 1,
    toColumn: 2,
  },
  staticCards: [
    {
      id: "s1",
      title: "Lead Oficina Sul",
      value: "R$ 4.200",
      column: 0,
    },
    {
      id: "s2",
      title: "Projeto Atlas",
      value: "R$ 9.800",
      column: 0,
    },
    {
      id: "s3",
      title: "Contrato Verde",
      value: "R$ 22.000",
      column: 1,
    },
  ],
  showAudio: true,
};

/** Duration tuned to Pipedrive-style ~13s spot */
export const PRODUCT_DEMO_FPS = 30;
export const PRODUCT_DEMO_DURATION_FRAMES = 390; // 13s
export const PRODUCT_DEMO_WIDTH = 1080;
export const PRODUCT_DEMO_HEIGHT = 1920;
