import { Operator } from './types';
import fs from 'fs';
import path from 'path';

// Path to JSON data file
const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'operators.json');

// Read data from JSON file
function readData(): Operator[] {
  try {
    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading operators data file:', error);
    return [];
  }
}

// Write data to JSON file
function writeData(operators: Operator[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(operators, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing operators data file:', error);
    throw new Error('Failed to save operators data');
  }
}

export function getAllOperators(): Operator[] {
  return readData();
}

export function getOperatorById(id: string): Operator | null {
  const operators = readData();
  return operators.find(op => op.id === id) || null;
}

export function createOperator(operator: Operator): Operator {
  const operators = readData();

  // Check if operator with this ID already exists
  const exists = operators.some(op => op.id === operator.id);
  if (exists) {
    throw new Error(`Operator with ID "${operator.id}" already exists`);
  }

  operators.push(operator);
  writeData(operators);
  return operator;
}

export function updateOperator(id: string, updates: Partial<Operator>): Operator | null {
  const operators = readData();
  const index = operators.findIndex(op => op.id === id);

  if (index === -1) {
    return null;
  }

  // Merge updates with existing operator
  operators[index] = { ...operators[index], ...updates };
  writeData(operators);

  return operators[index];
}

export function deleteOperator(id: string): boolean {
  const operators = readData();
  const filteredOperators = operators.filter(op => op.id !== id);

  if (filteredOperators.length === operators.length) {
    return false; // No operator was deleted
  }

  writeData(filteredOperators);
  return true;
}

// Get operators by region
export function getOperatorsByRegion(region: string): Operator[] {
  const operators = readData();
  return operators.filter(op => op.regionTags.includes(region));
}

// Get operators by product
export function getOperatorsByProduct(product: string): Operator[] {
  const operators = readData();
  return operators.filter(op => op.productTags.includes(product));
}
