name: Feature Request
description: Request a new Feature
title: "[Feature Request]: "
labels: [feature request]
assignees:
- ktalebian
- rnairtwilio
body:
  - type: input
    id: summary
    attributes:
      label: Summary
      description: A clear and concise description of what the feature you are requesting is.
      placeholder: It would be amazing to add a way to do ...
    validations:
      required: true
  - type: textarea
    id: description
    attributes:
      label: Detailed Description
      description: A clear and concise description of what you want to happen.
      placeholder: When running this command, I'd expect to see X, Y, Z to happen.
    validations:
      required: true
  - type: textarea
    id: additional
    attributes:
      label: Detailed Description
      description: Add any other context or screenshots about the feature request here.
    validations:
      required: false
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
      required: false

