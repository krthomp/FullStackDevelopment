import { AuthResponse } from './authresponse';

describe('AuthResponse', () => {
  it('should create an instance', () => {
    const authResponse = new AuthResponse();
    expect(authResponse).toBeTruthy();
  });

  it('should have a token property', () => {
    const authResponse = new AuthResponse();
    expect(authResponse.token).toBeUndefined();  // token is undefined initially
  });
});
