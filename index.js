const { getOctokit } = require("@actions/github/lib/github");
const core = require("@actions/core");
const github = require("@actions/github");
const { mixesMigrationsWithOtherChanges } = require("./mixed-changes");

async function main() {
  try {
    const token = core.getInput("token");
    const migration_directory = core.getInput("migration-directory");
    const githubClient = getOctokit(token);

    const githubContext = github.context;
    const pullRequest = githubContext.issue;

    const endpointOptions = githubClient.pulls.listFiles.endpoint.merge({
      owner: pullRequest.owner,
      repo: pullRequest.repo,
      pull_number: pullRequest.number,
    });

    const files = await githubClient.paginate(endpointOptions, (response) =>
      response.data.map((file) => file.filename)
    );

    if (mixesMigrationsWithOtherChanges(files, migration_directory)) {
      core.setFailed(
        "This PR contains migrations and other changes. Migrations must be shipped independently."
      );
    } else {
      core.setOutput(
        "Either the PR contains no migrations or only migrations.",
        JSON.stringify(files)
      );
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
