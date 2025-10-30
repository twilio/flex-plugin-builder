# Troubleshooting & FAQ

#### Configuring Custom Domain for Local Development

You can configure a custom domain for local plugin development using the `--domain` flag. This is particularly important when using SSO v2 (OAuth flow), as `localhost` can cause authentication issues during login due to OAuth redirect URI restrictions.

**Why use a custom domain?**
- **SSO v2 OAuth Flow**: If you're using Twilio Flex with SSO v2 (OAuth authentication flow), `localhost` URLs may not be accepted as valid redirect URIs, causing login authentication failures
- **CORS Issues**: Some authentication systems restrict `localhost` for security reasons
- **Development Consistency**: Using a custom domain provides a more production-like development environment

**Usage:**
```bash
twilio flex:plugins:start --domain flex.local.com
```

**Setting up the custom domain:**
1. **macOS/Linux**: Add the domain to `/etc/hosts`
   ```bash
   sudo echo "127.0.0.1 flex.local.com" >> /etc/hosts
   ```

2. **Windows**: Add the domain to `C:\Windows\System32\drivers\etc\hosts`
   ```
   127.0.0.1 flex.local.com
   ```

**Available Options:**
- Without `--domain`: Uses `localhost` (default behavior, may cause issues with SSO v2)
- With `--domain flex.local.com`: Uses `flex.local.com` 
- With `--domain my-custom.dev`: Uses any custom domain you prefer

**When is this required?**
- **SSO v2 Users**: If your Twilio Flex instance uses SSO v2 with OAuth authentication, you will likely encounter login failures when using `localhost`
- **CORS-restricted environments**: Some authentication providers block `localhost` requests
- **Custom OAuth configurations**: If your OAuth provider has strict redirect URI policies

After configuring your hosts file, your local plugin development server will be accessible at the specified domain (e.g., `http://flex.local.com:3000`).

#### SSO v2 OAuth Authentication Issues with localhost

If you're experiencing login failures during local development, especially with error messages related to OAuth redirects or authentication, this is likely due to SSO v2 OAuth flow restrictions with `localhost` URLs.

**Common Error Symptoms:**
- Login redirects fail or loop infinitely
- OAuth callback errors mentioning invalid redirect URI
- Authentication timeouts during local development
- CORS errors related to authentication endpoints

**Solution:**
Use the `--domain` flag with a custom domain:
```bash
twilio flex:plugins:start --domain flex.local.com
```

Make sure to add the domain to your hosts file as described above. This resolves the OAuth redirect URI validation issues that occur with `localhost`.

#### npm install fails on NPM 7

If you are using `npm 7` (you can find out the version by typing `npm -v` in your terminal), then you may get the following error when you run `npm install`:

```bash
npm ERR! Could not resolve dependency:
npm ERR! peer react@"^16.14.0" from react-test-renderer@16.14.0
npm ERR! node_modules/enzyme-adapter-react-16/node_modules/react-test-renderer
npm ERR!   react-test-renderer@"^16.0.0-0" from enzyme-adapter-react-16@1.15.5
npm ERR!   node_modules/enzyme-adapter-react-16
npm ERR!     enzyme-adapter-react-16@"^1.14.0" from flex-plugin-test@4.3.5-beta.0
npm ERR!     node_modules/flex-plugin-test
npm ERR!       flex-plugin-test@"^4.3.5-beta.0" from flex-plugin-scripts@4.3.5-beta.0
npm ERR!       node_modules/flex-plugin-scripts
npm ERR! Fix the upstream dependency conflict, or retry
npm ERR! this command with --force, or --legacy-peer-deps
npm ERR! to accept an incorrect (and potentially broken) dependency resolution.
```

To fix this problem, update your package.json and include the `react-test-renderer` package and use the exact same version you've used for your `react` package.
