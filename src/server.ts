import mongoose from 'mongoose';
import app from './app';
import config from './config';
import { errorLogger, logger } from './shared/logger';

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    logger.info('Connected to MongoDB');

    app.listen(config.port, () => {
      logger.info(`express app listening on port ${config.port}`);
    });
  } catch (error) {
    errorLogger.error(error);
  }
}

bootstrap();
