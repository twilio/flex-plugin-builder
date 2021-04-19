/* eslint-disable import/no-unused-modules, no-console */
import { TestSuite, TestParams } from '..';

const testSuite: TestSuite = async (params: TestParams): Promise<void> => {
  /* Sample test */
  console.log(process.env);
};

export default testSuite;
