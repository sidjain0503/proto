const { z } = require("zod");

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(8080),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().optional().default(""),
  DB_NAME: z.string().min(1),
  ENVIRONMENT: z.enum(["local", "development", "staging", "production"]).default("local"),
  SECURITY_TOKEN_LIFE: z.string().min(1).default("8h"),
  SECURITY_TOKEN_SECRET: z.string().min(16, "SECURITY_TOKEN_SECRET must be at least 16 characters"),
  CORS_ORIGINS: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),
  OPENROUTER_BASE_URL: z.string().url().optional(),
  OLLAMA_BASE_URL: z.string().url().optional(),
  API_DOC_USER: z.string().optional(),
  API_DOC_PASSWORD: z.string().optional(),
  LANGFUSE_SECRET_KEY: z.string().optional(),
  LANGFUSE_PUBLIC_KEY: z.string().optional(),
  LANGFUSE_BASE_URL: z.string().url().optional(),
  LANGFUSE_TRACING_ENVIRONMENT: z.string().optional(),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .optional(),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    console.error("Environment validation failed:\n" + formatted);
    process.exit(1);
  }

  return result.data;
};

module.exports = { envSchema, parseEnv };
