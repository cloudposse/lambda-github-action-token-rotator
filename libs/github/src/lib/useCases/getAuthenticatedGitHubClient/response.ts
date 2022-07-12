import { Either, Result, AppError } from "@cloudposse/common";
import { Octokit } from "octokit";

import { GetAuthenticatedGitHubClientErrors } from "./errors";

export type GetAuthenticatedGitHubClientResponse = Either<
  | GetAuthenticatedGitHubClientErrors.GitHubApiError
  | AppError.UnexpectedError
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Result<any>,
  Result<Octokit>
>;
