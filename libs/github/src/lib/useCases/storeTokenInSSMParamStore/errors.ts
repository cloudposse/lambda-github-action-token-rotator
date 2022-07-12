/* eslint-disable @typescript-eslint/no-namespace */
import { Result, UseCaseError } from "@cloudposse/common";

export namespace StoreTokenInSSMParamStoreErrors {
  export class AWSApiError extends Result<UseCaseError> {
    constructor(errMessage: string) {
      const message = `An error occurred when calling the AWS API: ${errMessage}.`;
      super(false, {
        message,
      } as UseCaseError);
    }
  }
}
