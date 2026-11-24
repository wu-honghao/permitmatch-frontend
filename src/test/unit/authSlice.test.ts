import { describe, expect, it } from 'vitest';
import authReducer, { authInitialState, clearUserData, saveUserData } from '../../features/auth/authSlice';

describe('auth reducer', () => {
  it('stores authenticated user email', () => {
    expect(authReducer(authInitialState, saveUserData({ email: 'person@example.com' })))
      .toEqual({ userData: { email: 'person@example.com' } });
  });
  it('clears user data on logout', () => {
    const current = { userData: { email: 'person@example.com' } };
    expect(authReducer(current, clearUserData())).toEqual({ userData: { email: '' } });
  });
});
