import { ProviderInfo } from './types';
import fs from 'fs';
import path from 'path';

// Path to JSON data file
const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'providers.json');

// Read data from JSON file
function readData(): ProviderInfo[] {
  try {
    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading providers data file:', error);
    return [];
  }
}

export function getAllProviders(): ProviderInfo[] {
  return readData().sort((a, b) => a.name.localeCompare(b.name));
}

export function getProviderById(id: string): ProviderInfo | null {
  const providers = readData();
  return providers.find(provider => provider.id === id) || null;
}
