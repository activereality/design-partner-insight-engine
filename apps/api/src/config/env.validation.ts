type NodeEnv = 'development' | 'test' | 'production';

interface ValidatedEnvironment {
  MONGODB_URI: string;
  NODE_ENV: NodeEnv;
  PORT: number;
}

type EnvironmentInput = Record<string, string | undefined>;

const VALID_NODE_ENV_VALUES = new Set<NodeEnv>(['development', 'test', 'production']);

export function validateEnvironment(config: EnvironmentInput): ValidatedEnvironment {
  const port = parsePort(config.PORT);
  const nodeEnv = parseNodeEnv(config.NODE_ENV);
  const mongodbUri = parseMongoDbUri(config.MONGODB_URI);

  return {
    MONGODB_URI: mongodbUri,
    NODE_ENV: nodeEnv,
    PORT: port
  };
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
