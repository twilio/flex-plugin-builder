import { readFileSync } from 'fs';
import { join } from 'path';

describe('templates', () => {
  ['js2', 'ts2'].forEach((template) => {
    describe(template, () => {
      const pkg = JSON.parse(readFileSync(join(__dirname, '../../../templates', template, 'package.json'), 'utf8'));

      it('should not run a postinstall, since nothing a plugin installs provides the flex-plugin bin', () => {
        expect(pkg.scripts?.postinstall).toBeUndefined();
      });

      it('should not call flex-plugin-scripts from any script without depending on it', () => {
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        const callsScripts = Object.values<string>(pkg.scripts || {}).some((script) => /\bflex-plugin\b/.test(script));

        expect(!callsScripts || '@twilio/flex-plugin-scripts' in deps).toBe(true);
      });
    });
  });
});
