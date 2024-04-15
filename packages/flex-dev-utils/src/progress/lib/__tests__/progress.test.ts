/* eslint-disable @typescript-eslint/no-explicit-any */
import * as ora from '../progress';

describe('Progress', () => {
  const OLD_ENV = process.env;
  const respMsg = 'the-response';

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetAllMocks();

    process.env = { ...OLD_ENV };
  });

  describe('default', () => {
    const title = 'the-title';
    const getMockedMethods = () => {
      const spinner = {
        start: jest.fn(),
        succeed: jest.fn(),
        fail: jest.fn(),
      };
      // @ts-ignore
      jest.spyOn(ora, '_getSpinner').mockReturnValue(spinner);

      return spinner;
    };

    const expectOraCalled = (spinner: any, callback: any, disabled: boolean) => {
      expect(ora._getSpinner).toHaveBeenCalledTimes(1);
      expect(ora._getSpinner).toHaveBeenCalledWith(title, disabled);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(spinner.start).toHaveBeenCalledTimes(1);
    };

    it('should succeed', async () => {
      const spinner = getMockedMethods();
      const callback = jest.fn().mockResolvedValue(respMsg);
      const response = await ora.progress(title, callback);

      expectOraCalled(spinner, callback, false);
      expect(response).toEqual(respMsg);
      expect(spinner.succeed).toHaveBeenCalledTimes(1);
      expect(spinner.fail).not.toBeCalled();
    });

    it('should not start ora if disabled is true', async () => {
      const spinner = getMockedMethods();
      const callback = jest.fn().mockResolvedValue(respMsg);
      const response = await ora.progress(title, callback, true);

      expectOraCalled(spinner, callback, true);
      expect(response).toEqual(respMsg);
      expect(spinner.succeed).toHaveBeenCalledTimes(1);
      expect(spinner.fail).not.toBeCalled();
    });

    it('should not start ora if isQuiet', async () => {
      process.env.QUIET = 'true';
      const spinner = getMockedMethods();
      const callback = jest.fn().mockResolvedValue(respMsg);
      const response = await ora.progress(title, callback, true);

      expectOraCalled(spinner, callback, true);
      expect(response).toEqual(respMsg);
      expect(spinner.succeed).toHaveBeenCalledTimes(1);
      expect(spinner.fail).not.toBeCalled();
    });

    it('should fail', async () => {
      const error = 'the-error';
      const spinner = getMockedMethods();
      const callback = jest.fn().mockRejectedValue({ message: error });

      try {
        await ora.progress(title, callback);
      } catch (e) {
        expectOraCalled(spinner, callback, false);
        expect(spinner.fail).toHaveBeenCalledTimes(1);
        expect(spinner.fail).toHaveBeenCalledWith(error);
        expect(spinner.succeed).not.toBeCalled();
        expect(e.message).toEqual(error);
      }
    });
  });
});
