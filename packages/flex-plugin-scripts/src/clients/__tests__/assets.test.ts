import { AuthConfig } from "flex-dev-utils/dist/keytar";
import AssetClient from "../assets";
import FileClient from "../files";

jest.mock('../files');

describe('AssetClient', () => {
  const serviceSid = 'ZS00000000000000000000000000000000';
  const auth = {} as AuthConfig;

  it('should instantiate as an Asset', () => {
    new AssetClient(auth, serviceSid);
    expect(FileClient).toHaveBeenCalledTimes(1);
    expect(FileClient).toHaveBeenCalledWith(auth, 'Assets', serviceSid);
  });
});
