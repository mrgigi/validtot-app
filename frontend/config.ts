// Configuration values for the ValidToT frontend application

// The base URL for the backend API
// This is automatically configured by Encore.ts
export const API_BASE_URL = '';

// Application metadata
export const APP_NAME = 'ValidToT';
export const APP_DESCRIPTION = 'Visual This or That Voting Platform';
export const APP_VERSION = '1.0.0';

// UI Configuration
export const DEFAULT_THEME = 'system';
export const THEME_STORAGE_KEY = 'validtot-theme';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 50;

// Poll configuration
export const MAX_TITLE_LENGTH = 120;
export const MAX_DESCRIPTION_LENGTH = 250;
export const MAX_OPTION_TEXT_LENGTH = 100;

// Image configuration
export const SUPPORTED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
export const MAX_IMAGE_SIZE_MB = 10;
