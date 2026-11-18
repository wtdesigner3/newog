import fs from 'fs';

const svg = fs.readFileSync('public/images/og-logo.svg', 'utf8');
console.log('viewBox:', svg.match(/viewBox=["'][^"']+["']/)?.[0]);
console.log('Total SVG length:', svg.length);

// Let's check color fills or strokes in svg
const fills = svg.match(/fill:[^;"]+/g);
console.log('Unique fills:', [...new Set(fills)]);
