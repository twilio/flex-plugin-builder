The `deploy` script is used to build and deploy your Flex plugin directly to Twilio Assets using the Serverless API.

Usage:
    `npm run deploy [patch, minor, major, custom] -- {options}`
    
The script will build and deploy your plugin to Twilio Assets using Serverless API as a `patch, minor, major, or custom`. The `patch, minor, major` are semver bumps. The `custom` field takes an additional custom version value:


```bash
# current version 0.0.0

npm run deploy patch         # Will bump to 0.0.1
npm run deploy minor         # Will bump to 0.1.0
npm run deploy major         # Will bump to 1.0.0
npm run deploy custom 123    # Will bump to 123
```

#### Options

**--public**

By default, plugins are uploaded as Private plugin. A plugin can be uploaded as Public by setting the `--public` flag:

```bash
npm run deploy patch -- --public
```

#### Multiple Accounts

Plugin Builder v3 stores your credentials locally in your keychain so you do not have to re-enter your credentials every time. If you like to provide a new set of AccountSid / AuthToken, you may set them as environmental variables before invoking the deploy command:

```bash
TWILIO_ACCOUNT_SID=ACxxx TWILIO_AUTH_TOKEN=abc123 npm run deploy patch
```

This will use the newly provided credentials and save them in the keychain as well. If you have multiple accounts saved in the keychain, you will be prompted to select on at runtime:

```text
? Select from one of the following Account Sids (Use arrow keys)
❯ AC0000000000000000000000000000000 
  AC0000000000000000000000000000001
  AC0000000000000000000000000000002
```

Invoking with the TWILIO_ACCOUNT_SID environmental variable, however, will remove this step and the script will use the provided account.
