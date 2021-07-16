export function parseBooleanEnvironmentVariable(raw?: string): boolean | null {
  switch (raw) {
    case '1':
    case 'true': 
      return true;
    case '0': 
    case 'false': 
      return false;
    default: return null;
  }
}

/**
 * NOTE: In order to make environment variables readable by the front end,
 * they need to be included in global.gruntConfig.frontEnd.env
 * 
 * @see gruntfile.js
 */

export const VENDOR_ACCOUNT_CREATION_DISABLED = parseBooleanEnvironmentVariable(process.env.VENDOR_ACCOUNT_CREATION_DISABLED) || false;

export const SHOW_TEST_INDICATOR = parseBooleanEnvironmentVariable(process.env.SHOW_TEST_INDICATOR) || false;

export const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'digitalmarketplace@gov.bc.ca';

// Government's identity provider
export const GOV_IDP_SUFFIX = process.env.GOV_IDP_SUFFIX || 'idir';
export const GOV_IDP_NAME = process.env.GOV_IDP_NAME || 'IDIR';

// Vendors' identifiy provider
export const VENDOR_IDP_SUFFIX = process.env.VENDOR_IDP_SUFFIX || 'github';
export const VENDOR_IDP_NAME = process.env.VENDOR_IDP_NAME || 'GitHub';

export const TIMEZONE = process.env.TIMEZONE || 'America/Vancouver';

export const CWU_MAX_BUDGET = parseInt(process.env.CWU_MAX_BUDGET || '70000',10);

export const SWU_MAX_BUDGET = parseInt(process.env.SWU_MAX_BUDGET || '2000000',10);

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
