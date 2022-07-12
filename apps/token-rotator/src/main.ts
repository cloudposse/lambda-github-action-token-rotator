const config = process.env.NODE_ENV === "test" ? { path: `./.env.test` } : {};
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config(config);

import { getLogger, Guard } from "@cloudposse/common";
import {
  GetAuthenticatedGitHubClientUseCase,
  GetOrgRunnerRegistrationTokenUseCase,
  StoreTokenInSSMParamStoreUseCase,
} from "@cloudposse/github";
import { Context, EventBridgeEvent } from "aws-lambda";

const logger = getLogger("main");
logger.info("github action token rotator app starting up");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handler = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  _event: EventBridgeEvent<"Scheduled Event", any>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: Context
): Promise<void> => {
  try {
    const getAuthenticatedGitHubClient =
      new GetAuthenticatedGitHubClientUseCase();
    const getOrgRunnerRegistrationToken =
      new GetOrgRunnerRegistrationTokenUseCase();
    const storeTokenInSSMParamStore = new StoreTokenInSSMParamStoreUseCase();

    const {
      AWS_PARAM_STORE_TOKEN_PATH,
      AWS_REGION,
      GITHUB_APP_ID,
      GITHUB_INSTALLATION_ID,
      GITHUB_ORG,
      GITHUB_PRIVATE_KEY,
    } = extractEnvVars();

    const clientResult = await getAuthenticatedGitHubClient.execute({
      gitHubAppId: GITHUB_APP_ID,
      gitHubInstallationId: parseInt(GITHUB_INSTALLATION_ID),
      gitHubPrivateKey: GITHUB_PRIVATE_KEY,
    });

    if (clientResult.value.isFailure) {
      const err = clientResult.value.getErrorValue();
      logger.error(err);
      throw err;
    }

    const getTokenResult = await getOrgRunnerRegistrationToken.execute({
      githubOrganization: GITHUB_ORG,
      octokit: clientResult.value.getValue(),
    });

    if (getTokenResult.value.isFailure) {
      const err = getTokenResult.value.getErrorValue();
      logger.error(err);
      throw err;
    }

    const storeTokenResult = await storeTokenInSSMParamStore.execute({
      path: AWS_PARAM_STORE_TOKEN_PATH,

      region: AWS_REGION,
      token: getTokenResult.value.getValue(),
    });

    if (storeTokenResult.value.isFailure) {
      const err = storeTokenResult.value.getErrorValue();
      logger.error(err);
      throw err;
    }
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

const extractEnvVars = () => {
  const {
    AWS_REGION,
    GITHUB_APP_ID,
    GITHUB_INSTALLATION_ID,
    GITHUB_ORG,
    GITHUB_PRIVATE_KEY,
  } = process.env;
  const validateRequiredParamsOrError = Guard.againstNullOrUndefinedBulk([
    { argument: AWS_REGION, argumentName: "AWS_REGION" },
    { argument: GITHUB_APP_ID, argumentName: "GITHUB_APP_ID" },
    {
      argument: GITHUB_INSTALLATION_ID,
      argumentName: "GITHUB_INSTALLATION_ID",
    },
    { argument: GITHUB_ORG, argumentName: "GITHUB_ORG" },
    {
      argument: GITHUB_PRIVATE_KEY,
      argumentName: "GITHUB_PRIVATE_KEY",
    },
  ]);

  if (validateRequiredParamsOrError.isFailure) {
    logger.error(validateRequiredParamsOrError.getErrorValue());
    throw validateRequiredParamsOrError.getErrorValue();
  }

  const buff = Buffer.from(GITHUB_PRIVATE_KEY, "base64");
  const ascii = buff.toString("utf-8");

  const AWS_PARAM_STORE_TOKEN_PATH =
    process.env.AWS_PARAM_STORE_TOKEN_PATH ||
    `/github/runners/${GITHUB_ORG}/registrationToken`;

  return {
    AWS_PARAM_STORE_TOKEN_PATH,
    AWS_REGION,
    GITHUB_APP_ID,
    GITHUB_INSTALLATION_ID,
    GITHUB_ORG,
    GITHUB_PRIVATE_KEY: ascii,
  };
};

export { handler };
