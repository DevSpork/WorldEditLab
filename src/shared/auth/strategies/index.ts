export * from './local';
export * from './saml';

export const USED_STRATEGY = process.env.STRATEGY ? process.env.STRATEGY : 'local';
