import React from 'react';
import { FlexPlugin } from 'flex-plugin';

import CustomTaskListContainer from './containers/CustomTaskListContainer';
import reducers, { namespace } from './states';

const PLUGIN_NAME = '{{pluginClassName}}';

export default class {{pluginClassName}} extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   * @param manager { Flex.Manager }
   */
  init(flex, manager) {
    this.registerReducers(manager);

    const options = { sortOrder: -1 };
    flex.AgentDesktopView
      .Panel1
      .Content
      .add(<CustomTaskListContainer key="demo-component" />, options);
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // You need Flex-UI 1.9.0 or higher
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
