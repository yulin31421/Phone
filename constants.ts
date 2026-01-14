
import { DeviceSpec } from './types';

export const IPHONE_MODELS = [
  { id: 'iphone16pro', name: 'iPhone 16 Pro' },
  { id: 'iphone16promax', name: 'iPhone 16 Pro Max' },
  { id: 'iphone16', name: 'iPhone 16' },
  { id: 'iphone16plus', name: 'iPhone 16 Plus' },
  { id: 'iphone15', name: 'iPhone 15' },
  { id: 'iphone15plus', name: 'iPhone 15 Plus' },
  { id: 'iphonese3', name: 'iPhone SE (第 3 代)' },
];

export const DEVICE_SPECS: Record<string, Record<string, number>> = {
  iphone16pro: { 
    '128GB': 36900, 
    '256GB': 40400, 
    '512GB': 47400, 
    '1TB': 54400 
  },
  iphone16promax: { 
    '256GB': 44900, 
    '512GB': 51900, 
    '1TB': 58900 
  },
  iphone16: { 
    '128GB': 29900, 
    '256GB': 33400, 
    '512GB': 40400 
  },
  iphone16plus: { 
    '128GB': 32900, 
    '256GB': 36400, 
    '512GB': 43400 
  },
  iphone15: { 
    '128GB': 24900, 
    '256GB': 28400, 
    '512GB': 35400 
  },
  iphone15plus: { 
    '128GB': 27900, 
    '256GB': 31400, 
    '512GB': 38400 
  },
  iphonese3: { 
    '64GB': 14900, 
    '128GB': 16500, 
    '256GB': 20000 
  },
};

export const TELECOM_PROVIDERS = [
  { id: 'CHT', name: '中華電信', color: '#0067b8' },
  { id: 'TWM', name: '台灣大哥大', color: '#ff6600' },
  { id: 'FET', name: '遠傳電信', color: '#e60012' },
];

export const MONTHLY_FEES = [599, 799, 999, 1199, 1399, 1599, 1799, 2699];
export const CONTRACT_TERMS = [24, 30, 36, 48];
