# Troubleshooting & FAQ

#### Local Development URLs Changed from localhost to flex.local.com

Starting with this version, local plugin development uses `flex.local.com` instead of `localhost` to avoid login-related issues. You need to configure your local hosts file to point `flex.local.com` to `127.0.0.1`.

**On macOS/Linux:**
1. Open Terminal
2. Run: `sudo vim /etc/hosts` (or use your preferred text editor)
3. Add this line: `127.0.0.1 flex.local.com`
4. Save the file

**On Windows:**
1. Open Notepad as Administrator
2. Open the file: `C:\Windows\System32\drivers\etc\hosts`
3. Add this line: `127.0.0.1 flex.local.com`
4. Save the file

After making this change, your local plugin development server will be accessible at `http://flex.local.com:3000` instead of `http://localhost:3000`.

**Quick Setup Script (macOS/Linux only):**
You can also run the provided script to automatically configure your hosts file:
```bash
./scripts/setup-hosts.sh
```

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
