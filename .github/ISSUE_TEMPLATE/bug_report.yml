name: Bug Report
description: File a bug report
title: "[Bug]: "
labels: [bug]
assignees:
- ktalebian
- rnairtwilio
body:
  - type: input
    id: summary
    attributes:
      label: Summary
      description: A clear and concise description of what the bug is.
      placeholder: The command `twilio flex:plugins:deploy` fails.
    validations:
      required: true
  - type: textarea
    id: description
    attributes:
      label: Detailed Description
      description: A clear and concise description of what the bug is, including steps on how to reproduce it.
      placeholder: |
        Cannot deploy plugin because of version mismatch. I tried to first to:

        1. Run `npm install`
        2. Run `twilio flex:plugins:deploy`
    validations:
      required: true
  - type: textarea
    id: log
    attributes:
      label: Log output
      description: Please paste any log output you are running. Include `-l debug` when using the CLI command.
      render: text
    validations:
      required: false
  - type: input
    id: version-flex-ui
    attributes:
      label: Version of @twilio/flex-ui
      description: What version of `@twilio/flex-ui` are you using? Use `grep version node_modules/@twilio/flex-ui/package.json`.
      placeholder: 1.27.0
    validations:
      required: true
  - type: input
    id: version-flex-plugin-scripts
    attributes:
      label: Version of flex-plugin-scripts
      description: What version of `flex-plugin-scripts` are you using? Use `grep version node_modules/flex-plugin-scripts/package.json`.
      placeholder: 4.0.1
    validations:
      required: true
  - type: input
    id: version-plugins-cli
    attributes:
      label: Version of @twilio-labs/plugin-flex
      description: What version of `@twilio-labs/plugin-flex` are you using? Use `twilio plugins`.
      placeholder: 4.0.1
    validations:
      required: true
  - type: input
    id: version-node
    attributes:
      label: Version of node
      description: What version of `node` are you using? Use `node -v`
      placeholder: 12.14.3
    validations:
      required: true
  - type: input
    id: version-npm
    attributes:
      label: Version of npm
      description: What version of `npm` are you using? Use `npm -v`
      placeholder: 7.5.3
    validations:
      required: true
  - type: dropdown
    id: os
    attributes:
      label: OS
      description: What OS are you using?
      options:
        - Mac (Default)
        - Window
        - Linux
    validations:
      required: true
  - type: textarea
    id: package
    attributes:
      label: Content of package.json
      description: Please include the entire content of your `package.json`.
      render: json
