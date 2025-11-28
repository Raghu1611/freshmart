const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'debug_log.txt');
function log(msg) {
    fs.appendFileSync(logFile, msg + '\n');
}

log('Script started');

try {
    const pagesDir = path.join(__dirname, 'src', 'pages');
    log('Pages dir: ' + pagesDir);

    if (!fs.existsSync(pagesDir)) {
        log('Pages dir does not exist!');
        process.exit(1);
    }

    const adminDir = path.join(pagesDir, 'admin');
    const clientDir = path.join(pagesDir, 'client');
    log('Admin dir: ' + adminDir);
    log('Client dir: ' + clientDir);

    const adminFiles = ['AdminDashboard.jsx']; // Test with one file

    adminFiles.forEach(file => {
        const oldPath = path.join(pagesDir, file);
        log('Checking ' + oldPath);
        if (fs.existsSync(oldPath)) {
            log('Found ' + file);
            // Just copy for now to test
            fs.copyFileSync(oldPath, path.join(adminDir, file));
            log('Copied ' + file);
        } else {
            log('Not found ' + file);
        }
    });

} catch (e) {
    log('Error: ' + e.message);
}
