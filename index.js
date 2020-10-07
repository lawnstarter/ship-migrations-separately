const core = require("@actions/core");
const github = require("@actions/github");

async function main() {
  try {
    const token = core.getInput("token");
    const pull_number = core.getInput("pull-number");
    const migration_directory = core.getInput("migration-directory");
    const githubClient = new github.GitHub(token);

    const contextPayload = github.context.payload;

    console.log("pull_number", pull_number);

    const endpointOptions = githubClient.pulls.listFiles.endpoint.merge({
      owner: contextPayload.repository.owner.login,
      repo: contextPayload.repository.name,
      pull_number,
    });

    let hasOneOrMoreMigration = false;
    let hasOtherChange = false;

    const files = await githubClient.paginate(endpointOptions, (response) => {
      response.data.map((file) => {
        if (file.filename.indexOf(migration_directory) !== -1) {
          hasOneOrMoreMigration = true;
        } else {
          hasOtherChange = true;
        }

        return file.filename;
      });
    });

    if (hasOneOrMoreMigration && hasOtherChange) {
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
