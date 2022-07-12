import { Either, Result, AppError } from "@cloudposse/common";

import { GetOrgRunnerRegistrationTokenErrors } from "./errors";

export type GetOrgRunnerRegistrationTokenResponse = Either<
  | GetOrgRunnerRegistrationTokenErrors.GitHubApiError
  | AppError.UnexpectedError
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Result<any>,
  Result<string>
>;
