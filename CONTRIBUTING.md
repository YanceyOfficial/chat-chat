# Hyper Chat Contributing Guide

Hi! We are really excited that you are interested in contributing to Hyper Chat. Before submitting your contribution, please make sure to take a moment and read through the following guide:

## Repo Setup

To develop and test the core `Hyper Chat` package, please respect the [Electron Guide](https://www.electronjs.org/) and [Electron Forge Guide](https://www.electronforge.io/).

## Pull Request Guidelines

- Checkout a topic branch from a base branch, e.g. `master`, and merge back against that branch.

- If adding a new feature:

  - Add accompanying test case.
  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.

- If fixing bug:

  - If you are resolving a special issue, add `(fix #xxxx[,#xxxx])` (#xxxx is the issue id) in your PR title for a better release log, e.g. `fix: update entities encoding/decoding (fix #3899)`.
  - Provide a detailed description of the bug in the PR. Live demo preferred.
  - Add appropriate test coverage if applicable.

- It's OK to have multiple small commits as you work on the PR - GitHub can automatically squash them before merging.

- Make sure tests pass!

- Commit messages must follow the [Angular Team's Commit Message Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit) so that changelogs can be automatically generated. Commit messages are automatically validated before commit.
- No need to worry about code style as long as you have installed the dev dependencies - modified files are automatically formatted with Prettier on commit.
