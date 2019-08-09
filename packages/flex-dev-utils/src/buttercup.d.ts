declare module '@buttercup/credentials' {
  type Credential = {
    type: string;
    accountSid: string;
    authToken: string;
  }

  export interface CredentialsInstance {
    toSecureString(password: string): Promise<string>;
    data: Credential;
  }

  declare const Credentials: {
    new(object: Credential): CredentialsInstance;
    fromSecureString(content: string, password: string): Promise<CredentialsInstance>;
  }

  export default Credentials;
}

