The `deploy` script is used to build and deploy your Flex plugin directly to Twilio Assets using the Serverless API.

Usage:
    `npm run deploy -- {options}`

The script will build and deploy your plugin to Twilio Assets using Serverless API. Please note that your AccountSid and AuthToken are required to use this script.

#### Options

**--public**

By default, plugins are uploaded as Private plugin. A plugin can be uploaded as Public by setting the `--public` flag:

```bash
npm run deploy -- --public
```

#### Multiple Accounts

Plugin Builder v3 stores your credentials locally in your keychain so you do not have to re-enter your credentials every time. If you like to provide a new set of AccountSid / AuthToken, you may set them as environmental variables before invoking the deploy command:

```bash
TWILIO_ACCOUNT_SID=ACxxx TWILIO_AUTH_TOKEN=abc123 npm run deploy
```

This will use the newly provided credentials and save them in the keychain as well. If you have multiple accounts saved in the keychain, you will be prompted to select on at runtime:

```text
? Select from one of the following Account Sids (Use arrow keys)
❯ AC0000000000000000000000000000000 
  AC0000000000000000000000000000001
  AC0000000000000000000000000000002
```

Invoking with the TWILIO_ACCOUNT_SID environmental variable, however, will remove this step and the script will use the provided account.
