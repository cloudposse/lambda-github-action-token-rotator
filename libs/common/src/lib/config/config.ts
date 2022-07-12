type LoggingLevels = "debug" | "info" | "warn" | "error";
interface IConfig {
  env: string;
  loggingLevel: LoggingLevels;
  slack: ISlackConfig;
}

interface ISlackConfig {
  oAuthToken: string;
  secret: string;
  signingSecret: string;
}

interface ISpacelliftToSlackConfig {
  slackChannel: string;
}

class Config implements IConfig {
  private static instance: Config;
  env: string;
  loggingLevel: LoggingLevels;
  slack: ISlackConfig;
  spacelliftToSlackConfig: ISpacelliftToSlackConfig;

  private constructor() {
    this.env = process.env.NODE_ENV || "development";
    this.loggingLevel =
      (process.env.BOSSY_LOGGING_LEVEL as LoggingLevels) || "debug";

    this.slack = {} as ISlackConfig;
    this.slack.oAuthToken = process.env.BOSSY_SLACK_OAUTH_TOKEN;
    this.slack.secret = process.env.BOSSY_SLACK_SECRET;
    this.slack.signingSecret = process.env.BOSSY_SLACK_SIGNING_SECRET;

    this.spacelliftToSlackConfig = {} as ISpacelliftToSlackConfig;
    this.spacelliftToSlackConfig.slackChannel =
      process.env.BOSSY_SPACELIFT_TO_SLACK_CHANNEL;
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }

    return Config.instance;
  }
}

const config = Config.getInstance();

export { config };
