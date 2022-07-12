import {
  AppError,
  Guard,
  left,
  Result,
  right,
  UseCase,
} from "@cloudposse/common";

import { GetOrgRunnerRegistrationTokenDTO } from "./dto";
import { GetOrgRunnerRegistrationTokenErrors } from "./errors";
import { GetOrgRunnerRegistrationTokenResponse } from "./response";

export class GetOrgRunnerRegistrationTokenUseCase
  implements
    UseCase<
      GetOrgRunnerRegistrationTokenDTO,
      Promise<GetOrgRunnerRegistrationTokenResponse>
    >
{
  public async execute(
    req: GetOrgRunnerRegistrationTokenDTO
  ): Promise<GetOrgRunnerRegistrationTokenResponse> {
    try {
      const validateRequiredParamsOrError = Guard.againstNullOrUndefinedBulk([
        {
          argument: req.githubOrganization,
          argumentName: "githubOrganization",
        },
      ]);

      if (validateRequiredParamsOrError.isFailure) {
        return left(validateRequiredParamsOrError);
      }

      try {
        const apiResponse =
          await req.octokit.rest.actions.createRegistrationTokenForOrg({
            org: req.githubOrganization,
          });

        if (apiResponse.status != 201) {
          return left(
            new GetOrgRunnerRegistrationTokenErrors.GitHubApiError(
              apiResponse.status
            )
          );
        }

        return right(Result.ok<string>(apiResponse.data.token));
      } catch (err) {
        console.error("here");
        console.error(JSON.stringify(err, null, 2));
        console.error(JSON.stringify(err.stack, null, 2));

        return left(
          new GetOrgRunnerRegistrationTokenErrors.GitHubApiError(
            (err as Error).message
          )
        );
      }
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
