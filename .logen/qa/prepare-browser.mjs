import { execFileSync } from 'node:child_process';
// Playwright's downloaded Ubuntu browser cannot execute on Alpine/musl.
// Install Alpine's native test browser, without changing the application runtime.
execFileSync('apk', ['add', '--no-cache', 'chromium'], { stdio: 'inherit' });
