/* eslint-disable @typescript-eslint/no-namespace */
import { Result, UseCaseError } from "@cloudposse/common";

export namespace GetOrgRunnerRegistrationTokenErrors {
  export class GitHubApiError extends Result<UseCaseError> {
    constructor(errMessage: string) {
      const message = `An error occurred when calling the GitHub API: ${errMessage}.`;
      super(false, {
        message,
      } as UseCaseError);
    }
  }
}
