// app/experiments.ts
export type Variant = "variant" | "controller";

export type ExperimentConfig = {
  key: string;
  matcher: RegExp;
  allocation?: { A: number; B?: number };
  enabled?: boolean;
  cookieMaxAgeDays?: number;
};

export const experiments: ExperimentConfig[] = [
  {
    key: "home",
    matcher: /^\/$/i,
    allocation: { A: 0.5, B: 0.5 },
    enabled: true,
  },
  {
    key: "pricing",
    matcher: /^\/pricing\/?$/i,
    allocation: { A: 0.2, B: 0.8 },
    enabled: true,
  },
  {
    key: "product",
    matcher: /^\/product\/[\w-]+\/?$/i,
    enabled: true,
  },
];
