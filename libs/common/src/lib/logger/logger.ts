import { createLogger, format, Logger, transports } from "winston";

import { config } from "../config";

const { combine, printf, timestamp } = format;

const cloudPosseFormat = printf((info) => {
  return `[${info?.timestamp}] ${info?.service} [${info?.level}]:  ${
    info?.stack ?? info?.message
  }`;
});

const getLogger = (service: string): Logger =>
  createLogger({
    transports: [new transports.Console()],
    level: config.loggingLevel,
    format: combine(timestamp(), cloudPosseFormat),
    defaultMeta: {
      service,
    },
  });

export { getLogger };
