import factory from 'yargs/yargs';
import createFlexPlugin from './create-flex-plugin';
import { stripIndent } from 'common-tags';

export default cli;

function cli(cwd) {
  const parser = factory(null, cwd);

  parser.alias('h', 'help');
  parser.alias('v', 'version');

  parser.usage(
    '$0 <name>',
    stripIndent`
    Creates a new Twilio Flex Plugin project
    
    Arguments:
    name\tName of your plugin. Needs to start with plugin-
    `,
    yargs => {
      yargs.options({
        accountSid: {
          alias: 'a',
          describe: 'The Account SID for your Flex Project',
        },
        runtimeUrl: {
          alias: 'r',
          describe: 'The URL to your Twilio Flex Runtime',
        },
        install: {
          type: 'boolean',
          describe: 'Auto-install dependencies',
          default: false,
        },
        yarn: {
          type: 'boolean',
          describe: 'Use yarn instead of npm to install',
          default: false,
        },
        adminPlugin: {
          type: 'boolean',
          describe: 'Load admin plugin'
        }
      });
    },
    argv => createFlexPlugin(argv)
  );

  return parser;
}
