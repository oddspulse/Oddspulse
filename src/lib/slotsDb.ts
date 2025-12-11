import { SlotGame } from './types';
import fs from 'fs';
import path from 'path';

// Path to JSON data file
const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'slots.json');

// Read data from JSON file
function readData(): SlotGame[] {
  try {
    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading slots data file:', error);
    return [];
  }
}

// Write data to JSON file
function writeData(slots: SlotGame[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(slots, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing slots data file:', error);
    throw new Error('Failed to save slots data');
  }
}

export function getAllSlots(): SlotGame[] {
  return readData().sort((a, b) => b.rtp - a.rtp); // Sort by RTP descending
}

export function getSlotById(id: string): SlotGame | null {
  const slots = readData();
  return slots.find(slot => slot.id === id) || null;
}

export function createSlot(slot: SlotGame): SlotGame {
  const slots = readData();

  // Check if slot with this ID already exists
  const exists = slots.some(s => s.id === slot.id);
  if (exists) {
    throw new Error(`Slot with ID "${slot.id}" already exists`);
  }

  slots.push(slot);
  writeData(slots);
  return slot;
}

export function updateSlot(id: string, updates: Partial<SlotGame>): SlotGame | null {
  const slots = readData();
  const index = slots.findIndex(slot => slot.id === id);

  if (index === -1) {
    return null;
  }

  // Merge updates with existing slot
  slots[index] = { ...slots[index], ...updates };
  writeData(slots);

  return slots[index];
}

export function deleteSlot(id: string): boolean {
  const slots = readData();
  const filteredSlots = slots.filter(slot => slot.id !== id);

  if (filteredSlots.length === slots.length) {
    return false; // No slot was deleted
  }

  writeData(filteredSlots);
  return true;
}

// Get unique providers from slots data
export function getUniqueProviders(): string[] {
  const slots = readData();
  const providers = Array.from(new Set(slots.map(slot => slot.provider)));
  return providers.sort();
}

// Get slots by provider
export function getSlotsByProvider(provider: string): SlotGame[] {
  const slots = readData();
  return slots.filter(slot => slot.provider === provider).sort((a, b) => b.rtp - a.rtp);
}

// Get high RTP slots (above threshold)
export function getHighRtpSlots(minRtp: number = 96): SlotGame[] {
  const slots = readData();
  return slots.filter(slot => slot.rtp >= minRtp).sort((a, b) => b.rtp - a.rtp);
}

// Get slots with bonus buy feature
export function getBonusBuySlots(): SlotGame[] {
  const slots = readData();
  return slots.filter(slot => slot.hasBonusBuy === true).sort((a, b) => b.rtp - a.rtp);
}

// Get high max win slots
export function getHighMaxWinSlots(minMaxWin: number = 10000): SlotGame[] {
  const slots = readData();
  return slots.filter(slot => (slot.maxWinMultiplier || 0) >= minMaxWin).sort((a, b) => (b.maxWinMultiplier || 0) - (a.maxWinMultiplier || 0));
}
