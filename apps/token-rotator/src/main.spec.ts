import { SSMClient, PutParameterCommand } from "@aws-sdk/client-ssm";
import { mockClient } from "aws-sdk-client-mock";
import LambdaTester from "lambda-tester";

import { handler } from "./main";

describe("lambdas", () => {
  const ssmClientMock = mockClient(SSMClient);

  beforeEach(() => {
    ssmClientMock.reset();
    ssmClientMock.on(PutParameterCommand).resolves({
      $metadata: {
        httpStatusCode: 200,
      },
    });
  });

  describe("token-rotator", () => {
    it("completes without error", async () => {
      const result = await LambdaTester(handler).event({}).expectResult();
      expect(result).toBeUndefined();
    });
  });
});
