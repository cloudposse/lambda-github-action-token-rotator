import { SSMClient, PutParameterCommand } from "@aws-sdk/client-ssm";
import { mockClient } from "aws-sdk-client-mock";
import LambdaTester from "lambda-tester";

import { handler } from "./main";

describe("lambdas", () => {
  const ssmClientMock = mockClient(SSMClient);

  beforeEach(() => {
    ssmClientMock.reset();
    // ssmClientMock.on(PutParameterCommand).resolves({
    //   $metadata: {
    //     httpStatusCode: 200,
    //   },
    // });
    ssmClientMock
      .on(PutParameterCommand)
      .rejects({ $metadata: { httpStatusCode: 500 } });
  });

  describe("token-rotator", () => {
    it("returns does not throw error", async () => {
      const result = await LambdaTester(handler).event({}).expectResult();
      expect(result).toBeUndefined();
    });
  });
});
