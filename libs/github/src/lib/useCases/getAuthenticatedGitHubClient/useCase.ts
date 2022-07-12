import {
  AppError,
  Guard,
  left,
  Result,
  right,
  UseCase,
} from "@cloudposse/common";
import { App, Octokit } from "octokit";

import { GetAuthenticatedGitHubClientDTO } from "./dto";
import { GetAuthenticatedGitHubClientErrors } from "./errors";
import { GetAuthenticatedGitHubClientResponse } from "./response";

export class GetAuthenticatedGitHubClientUseCase
  implements
    UseCase<
      GetAuthenticatedGitHubClientDTO,
      Promise<GetAuthenticatedGitHubClientResponse>
    >
{
  public async execute(
    req: GetAuthenticatedGitHubClientDTO
  ): Promise<GetAuthenticatedGitHubClientResponse> {
    try {
      const validateRequiredParamsOrError = Guard.againstNullOrUndefinedBulk([
        {
          argument: req.gitHubAppId,
          argumentName: "gitHubAppId",
        },
        {
          argument: req.gitHubInstallationId,
          argumentName: "gitHubInstallationId",
        },
        {
          argument: req.gitHubPrivateKey,
          argumentName: "gitHubPrivateKey",
        },
      ]);

      if (validateRequiredParamsOrError.isFailure) {
        return left(validateRequiredParamsOrError);
      }

      try {
        const { gitHubAppId, gitHubInstallationId, gitHubPrivateKey } = req;
        const app = new App({
          appId: gitHubAppId,
          privateKey: gitHubPrivateKey,
          log: console,
        });

        const octokit = await app.getInstallationOctokit(gitHubInstallationId);
        return right(Result.ok<Octokit>(octokit));
      } catch (err) {
        return left(
          new GetAuthenticatedGitHubClientErrors.GitHubApiError(
            (err as Error).message
          )
        );
      }
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
