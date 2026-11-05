import { uploadFile, uploadResumeFile, isUploadFile } from '../src/lib/upload.js';
import assert from 'assert';

console.log('==================================================');
console.log('  TESTING FILE UPLOAD SECURITY ENGINE');
console.log('==================================================');

let passed = 0;
let failed = 0;

async function runTest(name, fn) {
  try {
    await fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.log(`[FAIL] ${name} -> ${err.message}`);
    failed++;
  }
}

// 1. Oversized file (> 5MB)
await runTest('Reject file > 5MB', async () => {
  const bigBuffer = Buffer.alloc(5 * 1024 * 1024 + 10);
  let threw = false;
  try {
    await uploadFile(bigBuffer, 'test', 'big');
  } catch (err) {
    threw = true;
    assert(err.message.includes('exceeds maximum allowed limit'));
  }
  assert(threw, 'Should have thrown for oversized file');
});

// 2. Dangerous extension (.php)
await runTest('Reject executable extension (.php)', async () => {
  const fakePhp = {
    name: 'shell.php',
    arrayBuffer: async () => Buffer.from('<?php echo "evil"; ?>')
  };
  let threw = false;
  try {
    await uploadFile(fakePhp, 'test', 'shell');
  } catch (err) {
    threw = true;
    assert(err.message.includes('Security Exception'));
  }
  assert(threw, 'Should have thrown for .php file');
});

// 3. Corrupted / Fake JPEG (starts with text instead of FF D8 FF)
await runTest('Reject fake JPEG lacking magic bytes', async () => {
  const fakeJpg = {
    name: 'fake.jpg',
    arrayBuffer: async () => Buffer.from('Not a real image file content')
  };
  let threw = false;
  try {
    await uploadFile(fakeJpg, 'test', 'fake');
  } catch (err) {
    threw = true;
    assert(err.message.includes('Unsupported or unrecognized file signature'));
  }
  assert(threw, 'Should have thrown for fake JPEG signature');
});

// 4. Valid PNG signature
await runTest('Accept valid PNG magic bytes', async () => {
  const pngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00]);
  const file = {
    name: 'clean.png',
    arrayBuffer: async () => pngHeader
  };
  const url = await uploadFile(file, 'test', 'clean');
  assert(url.endsWith('.png'));
  assert(url.startsWith('/uploads/test/'));
});

// 5. Valid JPEG signature
await runTest('Accept valid JPEG magic bytes', async () => {
  const jpgHeader = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46]);
  const file = {
    name: 'clean.jpg',
    arrayBuffer: async () => jpgHeader
  };
  const url = await uploadFile(file, 'test', 'clean');
  assert(url.endsWith('.jpg'));
  assert(url.startsWith('/uploads/test/'));
});

// 6. SVG with Stored XSS Script tag
await runTest('Reject SVG containing <script> tag', async () => {
  const evilSvg = `<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><circle cx="50" cy="50" r="40"/></svg>`;
  const file = {
    name: 'vector.svg',
    arrayBuffer: async () => Buffer.from(evilSvg)
  };
  let threw = false;
  try {
    await uploadFile(file, 'test', 'xss');
  } catch (err) {
    threw = true;
    assert(err.message.includes('SVG contains forbidden script'));
  }
  assert(threw, 'Should have thrown for SVG with script tag');
});

// 7. Resume upload - PDF validation
await runTest('Resume upload accepts valid PDF', async () => {
  const pdfContent = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF');
  const file = {
    name: 'candidate_resume.pdf',
    arrayBuffer: async () => pdfContent
  };
  const url = await uploadResumeFile(file);
  assert(url.endsWith('.pdf'));
  assert(url.startsWith('/uploads/resumes/'));
});

// 8. Resume upload - Rejects non-PDF
await runTest('Resume upload rejects non-PDF file', async () => {
  const jpgContent = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]);
  const file = {
    name: 'resume.jpg',
    arrayBuffer: async () => jpgContent
  };
  let threw = false;
  try {
    await uploadResumeFile(file);
  } catch (err) {
    threw = true;
    assert(err.message.includes('Resume must be a valid PDF document'));
  }
  assert(threw, 'Should have rejected non-PDF resume');
});

console.log('==================================================');
console.log(`TOTAL PASSED: ${passed}`);
console.log(`TOTAL FAILED: ${failed}`);
console.log('==================================================');

if (failed > 0) process.exit(1);

