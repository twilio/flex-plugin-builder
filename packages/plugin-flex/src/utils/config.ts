import { Pkg } from '../sub-commands/flex-plugin';
import { readJsonFile } from './fs';

export interface OClifTopic {
  description: string;
  flags: {
    [key: string]: string;
  };
  args: {
    [key: string]: string;
  };
  defaults: {
    [key: string]: string;
  };
}

export interface OclifConfig {
  name: string;
  commands: string;
  bin: string;
  devPlugins: string[];
  topics: {
    [key: string]: OClifTopic;
  };
}

/**
 * Reads the topic information from package.json
 * @param topicName the topic name to read
 */
export const getTopic = (topicName: string): OClifTopic => {
  const pkg = readJsonFile<Pkg>(__dirname, '../../package.json');
  if (!pkg || !pkg.oclif || !pkg.oclif.topics[topicName]) {
    return {
      description: 'No description available',
      flags: {},
      args: {},
      defaults: {},
    };
  }

  const topic = pkg.oclif.topics[topicName];
  topic.flags = topic.flags || {};
  topic.args = topic.args || {};
  topic.defaults = topic.defaults || {};

  return topic;
};
