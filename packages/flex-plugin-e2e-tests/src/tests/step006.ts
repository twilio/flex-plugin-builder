/* eslint-disable */
import { replaceInFile } from 'replace-in-file';
import { TestSuite, TestParams } from '..';
import { spawn, Browser, pluginHelper, ConsoleAPI, joinPath } from '../utils';

// Plugin start
const testSuite: TestSuite = async (params: TestParams): Promise<void> => {
  const tmpComponentText = 'hot reload works';

  const twilioCliResult = await spawn(`cd ${params.plugin.dir} && twilio`, ['flex:plugins:start'], { detached: true, shell: true });
  await pluginHelper.waitForPluginToStart(params.plugin.baseUrl);
  
  const consoleApi = new ConsoleAPI(params.consoleBaseUrl);
  const cookies = await consoleApi.getCookies();

  await Browser.create();

  try {
    // Plugin loads
    await Browser.loginViaConsole(cookies, params.consoleBaseUrl, params.plugin.baseUrl);
    await Browser.pluginIsVisible(params.plugin.componentText);

    // Verify hot reload
    await replaceInFile({
      files: joinPath(params.plugin.dir, 'src', 'components', 'CustomTaskList', 'CustomTaskList.jsx'),
      from: params.plugin.componentText,
      to: tmpComponentText,
    }); 

    await Browser.pluginIsVisible(tmpComponentText);
  } catch(e) {
    await Browser.kill();
    twilioCliResult.child?.kill();
    throw e;
  }

  await Browser.kill();
  twilioCliResult.child?.kill();

  await replaceInFile({
    files: joinPath(params.plugin.dir, 'src', 'components', 'CustomTaskList', 'CustomTaskList.jsx'),
    from: tmpComponentText,
    to: params.plugin.componentText,
  });
};
testSuite.description = 'Running {{twilio flex:plugins:start}}';

export default testSuite;
