const core = require("@actions/core");
const github = require("@actions/github");

async function main() {
  try {
    const token = core.getInput("ghToken");
    const githubClient = new github.GitHub(token);
    console.log("token", token);

    const contextPayload = github.context.payload;

    const endpointOptions = githubClient.pulls.listFiles.endpoint.merge({
      owner: contextPayload.repository.owner.login,
      repo: contextPayload.repository.name,
      pull_number: 2,
      // pull_number: contextPayload.pull_request.number,
    });

    console.log("contextPayload", contextPayload);

    let hasFileWithDropInName = false;

    const files = await githubClient.paginate(endpointOptions, (response) => {
      console.log("----------------------");
      console.log(response);
      console.log("----------------------");
      response.data.map((file) => {
        if (file.filename.indexOf("drop_") !== -1) {
          hasFileWithDropInName = true;
        }
        return file.filename;
      });
    });

    let hasMoreThanOneFile = files.length > 1;

    if (hasFileWithDropInName && hasMoreThanOneFile) {
      core.setFailed("uh oh - you dropped something");
    }

    core.setOutput("files", JSON.stringify(files));
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
