import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

import './app/app.component.spec';
import './app/services/data.service.spec';
import './app/components/loading/loading.component.spec';
import './app/components/error/error.component.spec';
import './app/components/header/header.component.spec';
import './app/pages/country/country.component.spec';
import './app/pages/home/home.component.spec';
import './app/pages/not-found/not-found.component.spec';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
