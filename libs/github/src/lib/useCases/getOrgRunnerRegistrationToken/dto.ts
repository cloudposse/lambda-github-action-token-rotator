import { Octokit } from "octokit";

interface GetOrgRunnerRegistrationTokenDTO {
  githubOrganization: string;
  octokit: Octokit;
}

export { GetOrgRunnerRegistrationTokenDTO };
