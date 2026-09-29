import * as matchers from './matchers';
import * as scripts from './utils';
declare global {
    namespace NodeJS {
        interface Global {
            utils: typeof scripts;
        }
    }
    namespace jest {
        interface Matchers<R> {
            toMatchPath: InstanceType<typeof matchers.ToMatchPath>['match'];
            toMatchPathContaining: InstanceType<typeof matchers.ToMatchPathContaining>['match'];
        }
        interface Expect {
            toMatchPath: typeof matchers.toMatchPath;
            toMatchPathContaining: typeof matchers.toMatchPathContaining;
        }
    }
}
