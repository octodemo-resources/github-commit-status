# github-commit-status

Adds a GitHub commit status to a repository for a specific commit.


## Inputs

  * `repository`: The full repository name to set the commit status on in the form of `{owner}/{repo}`
  * `sha`: The commit SHA that status is to be registered against, defaults to the `${{ github.sha }}` value which is based off the event that triggered the workflow
  * `context`: The string label for the commit status to differntiate from other statuses
  * `state`: The state of the commit status, must be one of `error`, `failure`, `pending`, `success`, defaults to `success`
  * `description`: An optional description for the status, maximum `140` characters
  * `target_url`: An optional URL for the commit status to be able to direct users to more details for the status
  * `token`: The GitHub token to use to set the commit status, defaults to the Actions workflow token
  * `github_api_url`: An optional URL to the REST API for the GitHub instance you are accessing. Defaults to the actions environment value


## Examples

Add a commit status recording unit tests passing for the current workflow:

```yaml
- name: Add commit status
  uses: octodemo-resources/github-commit-status@v1
    with:
      context: unit_test_results
      state: success
      description: Tests passed
      target_url: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
```