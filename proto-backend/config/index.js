require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT
  },
  jwtSecretKey: process.env.JWT_SECRET,
  AUTH_TOKEN_LIFE: process.env.SECURITY_TOKEN_LIFE,
  AUTH_TOKEN_SECRET: process.env.SECURITY_TOKEN_SECRET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  OPENROUTER_BASE_URL: process.env.OPENROUTER_BASE_URL,
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL,
  ENVIRONMENT: process.env.ENVIRONMENT,
  LANGFUSE_SECRET_KEY: process.env.LANGFUSE_SECRET_KEY,
  LANGFUSE_PUBLIC_KEY: process.env.LANGFUSE_PUBLIC_KEY,
  LANGFUSE_BASE_URL: process.env.LANGFUSE_BASE_URL,
  LANGFUSE_TRACING_ENVIRONMENT: process.env.LANGFUSE_TRACING_ENVIRONMENT,
};
