const fs = require('fs');
const path = require('path');

const clientDir = path.join(__dirname, 'src', 'pages', 'client');
const adminDir = path.join(__dirname, 'src', 'pages', 'admin');

function updateImportsInDir(dir) {
    if (!fs.existsSync(dir)) {
        console.log(`Directory not found: ${dir}`);
        return;
    }

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

    files.forEach(file => {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Check if we already updated it (to avoid double update if run multiple times)
        // A simple heuristic: if we see '../../components', it's likely updated.
        // But some files might not import components.
        // Let's just do the replacement.

        // Replace '../' with '../../'
        // We use a regex that matches "from '../" or 'from "../'
        const newContent = content.replace(/from\s+['"]\.\.\//g, (match) => {
            return match.replace('../', '../../');
        });

        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            console.log(`Updated imports in ${file}`);
        } else {
            console.log(`No changes needed for ${file}`);
        }
    });
}

console.log('Updating client files...');
updateImportsInDir(clientDir);

console.log('Updating admin files...');
updateImportsInDir(adminDir);
