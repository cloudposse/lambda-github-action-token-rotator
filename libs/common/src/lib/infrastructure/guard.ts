export type GuardResponse = string;

import { Result } from "./result";

export interface IGuardArgument {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  argument: any;
  argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export class Guard {
  public static againstNullOrUndefined(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    argument: any,
    argumentName: string
  ): Result<GuardResponse> {
    if (argument === null || argument === undefined) {
      return Result.fail<GuardResponse>(`${argumentName} is null or undefined`);
    } else {
      return Result.ok<GuardResponse>();
    }
  }

  public static againstNullOrUndefinedBulk(
    args: GuardArgumentCollection
  ): Result<GuardResponse> {
    for (const arg of args) {
      const result = this.againstNullOrUndefined(
        arg.argument,
        arg.argumentName
      );
      if (result.isFailure) return result;
    }

    return Result.ok<GuardResponse>();
  }
}
