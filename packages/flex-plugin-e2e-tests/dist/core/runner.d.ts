import { TestParams, TestScenario } from '.';
/**
 * Starts the runner
 * @param testParams    the {@link TestParams} to use
 * @param testScenarios the {@link TestScenario} to test against
 */
declare const runner: (testParams: TestParams, testScenarios: Partial<TestScenario>[]) => Promise<void>;
export default runner;
