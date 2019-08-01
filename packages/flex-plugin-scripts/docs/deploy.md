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
