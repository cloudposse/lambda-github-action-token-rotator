import { Either, Result, AppError } from "@cloudposse/common";

import { StoreTokenInSSMParamStoreErrors } from "./errors";

export type StoreTokenInSSMParamStoreResponse = Either<
  | StoreTokenInSSMParamStoreErrors.AWSApiError
  | AppError.UnexpectedError
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Result<any>,
  Result<void>
>;
