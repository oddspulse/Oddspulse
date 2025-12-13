/**
 * Logo Mapping Script
 * Scans /public/logos/ directory and creates a mapping of operator index -> logo extension
 * This ensures we use the correct file extension for each logo
 */

const fs = require('fs');
const path = require('path');

const LOGO_DIR = path.join(__dirname, '../public/logos');
const OPERATORS_FILE = path.join(__dirname, '../src/data/operators.json');
const LOGO_START = 1845;
const LOGO_COUNT = 31;

function detectLogoExtension(index) {
  const base = `IMG_${LOGO_START + index}`;
  const pngPath = path.join(LOGO_DIR, `${base}.png`);
  const jpegPath = path.join(LOGO_DIR, `${base}.jpeg`);

  if (fs.existsSync(pngPath)) {
    return 'png';
  } else if (fs.existsSync(jpegPath)) {
    return 'jpeg';
  }
  return null;
}

function mapLogosToOperators() {
  // Read existing operators
  const operators = JSON.parse(fs.readFileSync(OPERATORS_FILE, 'utf8'));

  if (operators.length !== LOGO_COUNT) {
    console.warn(`⚠️  Warning: Expected ${LOGO_COUNT} operators, found ${operators.length}`);
  }

  // Map logos by index
  const updatedOperators = operators.map((operator, index) => {
    const ext = detectLogoExtension(index);

    if (ext) {
      const logoPath = `/logos/IMG_${LOGO_START + index}.${ext}`;
      console.log(`✓ ${operator.name} -> ${logoPath}`);
      return {
        ...operator,
        logo: logoPath
      };
    } else {
      console.log(`⚠️  ${operator.name} -> No logo found`);
      return operator;
    }
  });

  // Write updated operators
  fs.writeFileSync(
    OPERATORS_FILE,
    JSON.stringify(updatedOperators, null, 2) + '\n',
    'utf8'
  );

  console.log(`\n✅ Successfully mapped ${LOGO_COUNT} logos to operators`);
}

// Run the mapping
mapLogosToOperators();
