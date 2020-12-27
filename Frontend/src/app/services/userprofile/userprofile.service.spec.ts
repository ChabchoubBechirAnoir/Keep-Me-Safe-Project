/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserprofileService } from './userprofile.service';

describe('Service: Userprofile', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserprofileService]
    });
  });

  it('should ...', inject([UserprofileService], (service: UserprofileService) => {
    expect(service).toBeTruthy();
  }));
});
