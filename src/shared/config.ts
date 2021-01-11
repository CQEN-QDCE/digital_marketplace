import findUp from 'find-up';
import dotenv from 'dotenv';
import { dirname, resolve } from 'path';

export function parseBooleanEnvironmentVariable(raw?: string): boolean | null {
  switch (raw) {
    case '1': return true;
    case '0': return false;
    default: return null;
  }
}

function get(name: string , fallback: string): string {
  return process.env[name] || fallback;
}

// export the root directory of the repository.
export const REPOSITORY_ROOT_DIR = dirname(findUp.sync('package.json') || '') || __dirname;

// Load environment variables from a .env file.
dotenv.config({
  debug: process.env.NODE_ENV === 'development',
  path: resolve(REPOSITORY_ROOT_DIR, '.env')
});


export const SHOW_TEST_INDICATOR = parseBooleanEnvironmentVariable(process.env.SHOW_TEST_INDICATOR) || false;

export const CONTACT_EMAIL = get('CONTACT_EMAIL','digitalmarketplace@gov.bc.ca');

export const GOV_IDP_SUFFIX = get('GOV_IDP_SUFFIX','idir');

export const GOV_IDP_NAME = get('GOV_IDP_NAME','IDIR');

export const VENDOR_IDP_SUFFIX = get('VENDOR_IDP_SUFFIX','github');

export const VENDOR_IDP_NAME = get('VENDOR_IDP_NAME','GitHub');

export const TIMEZONE = get('TIMEZONE','America/Vancouver');

export const CWU_MAX_BUDGET = parseInt(get('CWU_MAX_BUDGET','70000'),10);

export const SWU_MAX_BUDGET = parseInt(get('SWU_MAX_BUDGET','2000000'),10);

export const COPY = {
  appTermsTitle: 'Digital Marketplace Terms & Conditions for E-Bidding',
  gov: {
    name: {
      short: 'B.C. Government',
      long: 'Government of British Columbia'
    }
  },
  region: {
    name: {
      short: 'B.C.',
      long: 'British Columbia'
    }
  }
};

export const EMPTY_STRING = '—'; // emdash

export const DEFAULT_PAGE_SIZE = 20;
