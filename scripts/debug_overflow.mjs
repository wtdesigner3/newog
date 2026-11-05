import { execSync } from 'child_process';
import http from 'http';

// Let's launch Edge with remote debugging and query all elements overflowing
const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chromeProcess = execSync(`"${edge}" --headless --remote-debugging-port=9223 --disable-gpu --window-size=390,844 "http://localhost:3000"`, { timeout: 1000 });

