import {
  PutParameterCommand,
  PutParameterCommandInput,
  SSMClient,
} from "@aws-sdk/client-ssm";
import {
  AppError,
  Guard,
  left,
  Result,
  right,
  UseCase,
} from "@cloudposse/common";

import { StoreTokenInSSMParamStoreDTO } from "./dto";
import { StoreTokenInSSMParamStoreErrors } from "./errors";
import { StoreTokenInSSMParamStoreResponse } from "./response";

export class StoreTokenInSSMParamStoreUseCase
  implements
    UseCase<
      StoreTokenInSSMParamStoreDTO,
      Promise<StoreTokenInSSMParamStoreResponse>
    >
{
  public async execute(
    req: StoreTokenInSSMParamStoreDTO
  ): Promise<StoreTokenInSSMParamStoreResponse> {
    try {
      const validateRequiredParamsOrError = Guard.againstNullOrUndefinedBulk([
        { argument: req.path, argumentName: "path" },
        { argument: req.region, argumentName: "region" },
        { argument: req.token, argumentName: "token" },
      ]);

      if (validateRequiredParamsOrError.isFailure) {
        return left(validateRequiredParamsOrError);
      }

      try {
        const { path, region, token } = req;

        const client = new SSMClient({ region });
        const input: PutParameterCommandInput = {
          Name: path,
          Type: "SecureString",
          Value: token,
        };
        const command = new PutParameterCommand(input);
        const apiResponse = await client.send(command);

        if (apiResponse.$metadata?.httpStatusCode != 200) {
          return left(
            new StoreTokenInSSMParamStoreErrors.AWSApiError(
              apiResponse.$metadata?.httpStatusCode.toString()
            )
          );
        }

        return right(Result.ok<void>());
      } catch (err) {
        return left(
          new StoreTokenInSSMParamStoreErrors.AWSApiError(
            (err as Error).message
          )
        );
      }
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
