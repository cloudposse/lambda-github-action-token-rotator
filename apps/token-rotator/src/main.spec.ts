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
    // Skipped: this is a live-API test whose committed fixture (.env.test) authenticates
    // as GitHub App 217830 in the "skedrocket" org, which no longer exists — the GitHub API
    // returns "Integration not found" for every run. Restore by recreating a test App (and
    // moving its key out of the repo into a secret) or by mocking the GitHub API (e.g. nock).
    // Tracked in: https://github.com/cloudposse/lambda-github-action-token-rotator/issues/63
    it.skip("completes without error", async () => {
      const result = await LambdaTester(handler).event({}).expectResult();
      expect(result).toBeUndefined();
    });
  });
});
