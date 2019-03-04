import createFlexPlugin from '../src/create-flex-plugin';
import inquirer from 'inquirer';
import execa from 'execa';
import * as log from '../src/logging';

jest.mock('inquirer');
jest.mock('execa');
jest.mock('../src/logging');

describe('create-flex-plugin', () => {
  beforeEach(() => jest.clearAllMocks());

  test(`a 'plug-in' name should be specified`, async () => {
    // Arrange
    const spyExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    const config = {};

    // Act
    await createFlexPlugin(config);

    // Assert
    expect(spyExit).toHaveBeenCalledWith(1);
  });

  test(`should only accept plugin names starting with 'plugin-'`, async() => {
    // Act
    await createFlexPlugin({name: 'my-plugin'});

    // Assert
    expect(log.error).toHaveBeenCalledWith('Invalid plugin name. Names need to start with plugin-');
  });

  test(`should ask for an accountSid if not specified`, async() => {
    // Arrange
    inquirer.prompt = jest.fn(() => Promise.resolve({
      accountSid: 'test-sid'
    }));

    // Act
    await createFlexPlugin({
      name: 'plugin-test'
    });

    // Assert
    expect(inquirer.prompt).toHaveBeenCalledTimes(1);
  });

  test(`should not ask for an accountSid if already specified`, async() => {
    // Arrange
    inquirer.prompt = jest.fn();

    // Act
    await createFlexPlugin({
      name: 'plugin-test',
      accountSid: 'fake-sid'
    });

    // Assert
    expect(inquirer.prompt).not.toHaveBeenCalled();
  });

  test(`should not install any dependency by default`, async() => {
    // Act
    await createFlexPlugin({
      name: 'plugin-test',
      accountSid: 'fake-sid'
    });

    // Assert
    expect(execa).not.toHaveBeenCalled();
  });

  test(`should install the dependencies if specified`, async() => {
    // Act
    await createFlexPlugin({
      name: 'plugin-test',
      accountSid: 'fake-sid',
      install: true
    });

    // Assert
    expect(execa).toHaveBeenCalled();
  });
});
