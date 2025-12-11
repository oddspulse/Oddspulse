import Database from 'better-sqlite3';
import path from 'path';
import { Operator } from './types';

const dbPath = path.join(process.cwd(), 'database', 'operators.db');
let db: Database.Database;

export function getDb() {
  if (!db) {
    db = new Database(dbPath);
  }
  return db;
}

// Helper to parse JSON fields
function parseOperator(row: any): Operator {
  return {
    id: row.id,
    name: row.name,
    brandLogoUrl: row.brandLogoUrl,
    regionTags: JSON.parse(row.regionTags),
    productTags: JSON.parse(row.productTags),
    bonusHeadline: row.bonusHeadline,
    detailedOffer: row.detailedOffer || '',
    affiliateUrl: row.affiliateUrl,
    rtpInfo: row.rtpInfo || undefined,
    notes: row.notes || undefined,
  };
}

export function getAllOperators(): Operator[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM operators ORDER BY name').all();
  return rows.map(parseOperator);
}

export function getOperatorById(id: string): Operator | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM operators WHERE id = ?').get(id);
  return row ? parseOperator(row) : null;
}

export function createOperator(operator: Operator): Operator {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO operators (
      id, name, brandLogoUrl, regionTags, productTags, bonusHeadline,
      detailedOffer, affiliateUrl, rtpInfo, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    operator.id,
    operator.name,
    operator.brandLogoUrl,
    JSON.stringify(operator.regionTags),
    JSON.stringify(operator.productTags),
    operator.bonusHeadline,
    operator.detailedOffer,
    operator.affiliateUrl,
    operator.rtpInfo || null,
    operator.notes || null
  );

  return operator;
}

export function updateOperator(id: string, operator: Partial<Operator>): Operator | null {
  const db = getDb();
  const existing = getOperatorById(id);
  if (!existing) return null;

  const updated = { ...existing, ...operator };

  const stmt = db.prepare(`
    UPDATE operators SET
      name = ?,
      brandLogoUrl = ?,
      regionTags = ?,
      productTags = ?,
      bonusHeadline = ?,
      detailedOffer = ?,
      affiliateUrl = ?,
      rtpInfo = ?,
      notes = ?
    WHERE id = ?
  `);

  stmt.run(
    updated.name,
    updated.brandLogoUrl,
    JSON.stringify(updated.regionTags),
    JSON.stringify(updated.productTags),
    updated.bonusHeadline,
    updated.detailedOffer,
    updated.affiliateUrl,
    updated.rtpInfo || null,
    updated.notes || null,
    id
  );

  return updated;
}

export function deleteOperator(id: string): boolean {
  const db = getDb();
  const stmt = db.prepare('DELETE FROM operators WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}
