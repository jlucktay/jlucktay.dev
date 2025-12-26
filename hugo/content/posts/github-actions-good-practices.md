---
title: GitHub Actions — Good Practices
date: 2025-12-26T13:14:44Z
tags:
  - github actions
  - ci/cd
  - good practices
---

As CI/CD platforms go, I wouldn't say GitHub Actions is the greatest, it just seems to me to be the most prevalent these days. Kind of like Helm with respect to packaging Kubernetes resources, but that's a completely different blog post that I might write another day.

There are several patterns that I have accumulated in my time with GitHub Actions (GHA) that I think are worthwhile habits to establish. I won't call them best practices — that seems way too egotistical — I'll just call them good practices, so here they are in no particular order:

## Lint your workflows with `actionlint`

Run [actionlint](https://github.com/rhysd/actionlint?tab=readme-ov-file#actionlint) liberally. Get really meta about it and wire it up in its own GHA workflow. It'll catch all sorts of footguns in your YAML workflow files and the syntax therein. It also includes the fantastic [shellcheck](https://github.com/koalaman/shellcheck) which I swear by for the mountains of Bash scripts I tend to write.

## Pin versions to SHA hashes

Instead of simply copy/pasting something like `uses: actions/checkout@v6` into your GHA to use any old release that falls under this major version, go an extra step further [for security's sake](https://www.stepsecurity.io/blog/pinning-github-actions-for-enhanced-security-a-complete-guide) and pin to the specific SHA hash of a particular release, so that it looks like this instead:

```yaml
      - uses: actions/checkout@8e8c483db84b4bee98b60c0593521ed34d9990e8 # v6.0.1
```

Dependabot has the capability to keep pinned hashes like this up-to-date *including the semver comment*, which leads me right onto my next good practice.

## Configure Dependabot to stay on top of things

Dependabot has [support for many ecosystems](https://docs.github.com/en/code-security/dependabot/ecosystems-supported-by-dependabot/supported-ecosystems-and-repositories), one of which is GitHub Actions. As mentioned above, it can help to keep individual steps that are pinned to SHA hashes for security's sake up-to-date, as well as a host of other features.

The aforementioned capability came in thanks to [this PR in October 2022](https://github.com/dependabot/dependabot-core/pull/5951) and takes away a lot of the toil of maintaining workflows manually.

There's [plenty more reading here](https://docs.github.com/en/code-security/getting-started/dependabot-quickstart-guide) for all of the other good stuff Dependabot can help with.

## Move oversized `run` blocks into dedicated script files

This one is basically stolen wholesale from the brilliant [Task](https://taskfile.dev) and [its style guide entry](https://taskfile.dev/docs/styleguide#prefer-using-external-scripts-instead-of-multi-line-commands) for same.
No point authoring a shell script inside a YAML text block when instead you can hoist it in a dedicated file and get a lot more support and readability (editability?) from your IDE along the way.

## Authenticate with an App where possible or practical

When a regular GitHub token (i.e. the [built-in `${{ secrets.GITHUB_TOKEN }}`](https://docs.github.com/en/actions/tutorials/authenticate-with-github_token)) is used to, for example, create a commit and push that commit to another branch, that push event won't trigger any other GHAs; this is intentional on the platform's behalf, to prevent the knock-on effect of triggering other workflows. In the scenario where you **would** like one workflow to cause another to run, set up a GitHub App on your repo and use a token from that in the initial GHA run.
