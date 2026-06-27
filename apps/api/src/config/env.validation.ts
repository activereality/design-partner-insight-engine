type NodeEnv = 'development' | 'test' | 'production';
type AiProvider = 'mock' | 'openai';

interface ValidatedEnvironment {
  AI_PROVIDER: AiProvider;
  DEMO_TOOLS_ENABLED: boolean;
  MONGODB_URI: string;
  NODE_ENV: NodeEnv;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
  PORT: number;
}

type EnvironmentInput = Record<string, string | undefined>;

const VALID_NODE_ENV_VALUES = new Set<NodeEnv>(['development', 'test', 'production']);
const VALID_AI_PROVIDER_VALUES = new Set<AiProvider>(['mock', 'openai']);

export function validateEnvironment(config: EnvironmentInput): ValidatedEnvironment {
  const aiProvider = parseAiProvider(config.AI_PROVIDER);
  const port = parsePort(config.PORT);
  const nodeEnv = parseNodeEnv(config.NODE_ENV);
  const mongodbUri = parseMongoDbUri(config.MONGODB_URI);
  const demoToolsEnabled = parseBoolean(config.DEMO_TOOLS_ENABLED, false, 'DEMO_TOOLS_ENABLED');
  const openAiApiKey = parseOptionalString(config.OPENAI_API_KEY);
  const openAiModel = parseOptionalString(config.OPENAI_MODEL);

  if (aiProvider === 'openai' && (!openAiApiKey || !openAiModel)) {
    throw new Error('OPENAI_API_KEY and OPENAI_MODEL are required when AI_PROVIDER=openai');
  }

  return {
    AI_PROVIDER: aiProvider,
    DEMO_TOOLS_ENABLED: demoToolsEnabled,
    MONGODB_URI: mongodbUri,
    NODE_ENV: nodeEnv,
    ...(openAiApiKey ? { OPENAI_API_KEY: openAiApiKey } : {}),
    ...(openAiModel ? { OPENAI_MODEL: openAiModel } : {}),
    PORT: port
  };
}

function parseAiProvider(value: string | undefined): AiProvider {
  if (!value) {
    return 'mock';
  }

  if (!VALID_AI_PROVIDER_VALUES.has(value as AiProvider)) {
    throw new Error('AI_PROVIDER must be one of: mock, openai');
  }

  return value as AiProvider;
}

function parsePort(value: string | undefined): number {
  if (!value) {
    throw new Error('PORT is required');
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  return port;
}

function parseNodeEnv(value: string | undefined): NodeEnv {
  if (!value || !VALID_NODE_ENV_VALUES.has(value as NodeEnv)) {
    throw new Error('NODE_ENV must be one of: development, test, production');
  }

  return value as NodeEnv;
}

function parseMongoDbUri(value: string | undefined): string {
  if (!value) {
    throw new Error('MONGODB_URI is required');
  }

  if (!value.startsWith('mongodb://') && !value.startsWith('mongodb+srv://')) {
    throw new Error('MONGODB_URI must start with mongodb:// or mongodb+srv://');
  }

  return value;
}

function parseOptionalString(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function parseBoolean(value: string | undefined, defaultValue: boolean, key: string): boolean {
  if (!value) {
    return defaultValue;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  throw new Error(`${key} must be true or false`);
}
