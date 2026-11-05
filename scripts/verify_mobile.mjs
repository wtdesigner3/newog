import { execSync } from 'child_process';
import sharp from 'sharp';

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outFile = 'C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/mobile_verified_final.png';

execSync(`"${edge}" --headless --disable-gpu --window-size=430,932 --force-device-scale-factor=1 --hide-scrollbars --virtual-time-budget=4000 --screenshot="${outFile}" "http://localhost:3000/?slide=0"`);
console.log('Saved mobile_verified_final.png!');
