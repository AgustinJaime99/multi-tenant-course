export interface AppConfig {
  port: number;
  nodeEnv: string;
  frontendUrl: string;
  frontendPublicUrl: string;
  backendUrl: string;
  accessDurationMinutes: number;
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessExpires: string;
    refreshExpires: string;
  };
  payments: {
    stripe: { secretKey: string; webhookSecret: string };
    mercadopago: { accessToken: string; webhookSecret: string; testMode: boolean };
    binance: { apiKey: string; secretKey: string };
  };
}

export default (): AppConfig => ({
  port: parseInt(process.env.API_PORT ?? "4000", 10),
  nodeEnv: process.env.NODE_ENV ?? "development",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
  frontendPublicUrl: process.env.FRONTEND_PUBLIC_URL ?? process.env.FRONTEND_URL ?? "http://localhost:3000",
  backendUrl: process.env.BACKEND_URL ?? "http://localhost:4000",
  accessDurationMinutes: parseInt(process.env.ACCESS_DURATION_MINUTES ?? "131400", 10), // 131400 min = 3 months
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? "dev-access-secret",
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret",
    accessExpires: process.env.JWT_ACCESS_EXPIRES ?? "15m",
    refreshExpires: process.env.JWT_REFRESH_EXPIRES ?? "7d",
  },
  payments: {
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY ?? "",
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
    },
    mercadopago: {
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN ?? "",
      webhookSecret: process.env.MERCADOPAGO_WEBHOOK_SECRET ?? "",
      testMode: process.env.MERCADOPAGO_TEST_MODE === "true",
    },
    binance: {
      apiKey: process.env.BINANCE_PAY_API_KEY ?? "",
      secretKey: process.env.BINANCE_PAY_SECRET_KEY ?? "",
    },
  },
});
