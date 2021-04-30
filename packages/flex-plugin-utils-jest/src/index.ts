import * as matchers from './matchers';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

if (expect) {
  const extensions = Object.keys(matchers)
    .filter((k) => k.charAt(0).toLocaleLowerCase() === k.charAt(0))
    .reduce((extension, key) => {
      // eslint-disable-next-line import/namespace, @typescript-eslint/no-explicit-any
      extension[key] = (actual: any, ...expected: any[]) => matchers[key](actual).match(...expected);
      return extension;
    }, {});
  expect.extend(extensions);
} else {
  // eslint-disable-next-line no-console
  console.error("Unable to find Jest's global expect");
}
