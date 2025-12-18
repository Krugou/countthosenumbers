type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface Logger {
  debug: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
}

class ConsoleLogger implements Logger {
  private isDevelopment = import.meta.env.DEV;
  
  private log(level: LogLevel, message: string, ...args: unknown[]) {
    if (!this.isDevelopment && level === 'debug') {
      return;
    }
    
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    switch (level) {
      case 'debug':
        console.debug(prefix, message, ...args);
        break;
      case 'info':
        console.info(prefix, message, ...args);
        break;
      case 'warn':
        console.warn(prefix, message, ...args);
        break;
      case 'error':
        console.error(prefix, message, ...args);
        break;
    }
  }
  
  debug(message: string, ...args: unknown[]) {
    this.log('debug', message, ...args);
  }
  
  info(message: string, ...args: unknown[]) {
    this.log('info', message, ...args);
  }
  
  warn(message: string, ...args: unknown[]) {
    this.log('warn', message, ...args);
  }
  
  error(message: string, ...args: unknown[]) {
    this.log('error', message, ...args);
  }
}

export const logger = new ConsoleLogger();

// Game-specific logger contexts
export const gameLogger = {
  start: (config: unknown) => logger.info('Game started', { config }),
  submit: (answer: number, correct: number, isCorrect: boolean) => 
    logger.debug('Answer submitted', { answer, correct, isCorrect }),
  end: (score: number) => logger.info('Game ended', { score }),
  error: (context: string, error: Error) => logger.error(`Game error [${context}]`, error),
  debug: (message: string, ...args: unknown[]) => logger.debug(message, ...args),
  info: (message: string, ...args: unknown[]) => logger.info(message, ...args),
};

export const authLogger = {
  login: (method: string) => logger.info('User logged in', { method }),
  logout: () => logger.info('User logged out'),
  error: (context: string, error: Error) => logger.error(`Auth error [${context}]`, error),
};

export const leaderboardLogger = {
  scoreSubmit: (score: number, difficulty: string) => 
    logger.info('Score submitted to leaderboard', { score, difficulty }),
  error: (context: string, error: Error) => 
    logger.error(`Leaderboard error [${context}]`, error),
};