import * as ora from '../ora';

describe('ora', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetAllMocks();
  });

  describe('progress', () => {
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

    const expectOraCalled = (spinner: any, callback: any) => {
      expect(ora._getSpinner).toHaveBeenCalledTimes(1);
      expect(ora._getSpinner).toHaveBeenCalledWith(title);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(spinner);
      expect(spinner.start).toHaveBeenCalledTimes(1);
    };

    it('should succeed', async () => {
      const spinner = getMockedMethods();
      const callback = jest.fn().mockResolvedValue('the-response');
      const response = await ora.progress(title, callback);

      expectOraCalled(spinner, callback);
      expect(response).toEqual('the-response');
      expect(spinner.succeed).toHaveBeenCalledTimes(1);
      expect(spinner.fail).not.toBeCalled();
    });

    it('should fail', async (done) => {
      const error = 'the-error';
      const spinner = getMockedMethods();
      const callback = jest.fn().mockRejectedValue({ message: error });

      try {
        await ora.progress(title, callback);
      } catch (e) {
        expectOraCalled(spinner, callback);
        expect(spinner.fail).toHaveBeenCalledTimes(1);
        expect(spinner.fail).toHaveBeenCalledWith(error);
        expect(spinner.succeed).not.toBeCalled();
        expect(e.message).toEqual(error);

        done();
      }
    });
  });
});
