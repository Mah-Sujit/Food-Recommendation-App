import { TestBed } from '@angular/core/testing';

import { Auth0 } from './auth0';

describe('Auth0', () => {
  let service: Auth0;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Auth0);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
