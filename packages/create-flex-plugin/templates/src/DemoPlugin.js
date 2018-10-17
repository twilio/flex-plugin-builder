import { FlexPlugin } from 'flex-plugin';
import React from 'react';
import CustomTaskListComponent from './CustomTaskListComponent';

export default class {{pluginClassName}} extends FlexPlugin {
  name = '{{pluginClassName}}';

  init(flex, manager) {
    flex.TaskList.Content.add(<CustomTaskListComponent key="demo-component" />, {
      sortOrder: -1,
    });
  }
}
