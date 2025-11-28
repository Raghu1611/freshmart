const fs = require('fs');
const path = require('path');

try {
    const pagesDir = path.join(__dirname, 'src', 'pages');
    const clientDir = path.join(pagesDir, 'client');
    const adminDir = path.join(pagesDir, 'admin');

    console.log('Pages Dir:', pagesDir);

    if (!fs.existsSync(clientDir)) {
        console.log('Creating client dir');
        fs.mkdirSync(clientDir, { recursive: true });
    }

    const clientFiles = [
        'About.jsx', 'Cart.jsx', 'Checkout.jsx', 'Contact.jsx', 'Dashboard.jsx',
        'ForgotPassword.jsx', 'Home.jsx', 'Login.jsx', 'Menu.jsx', 'OrderHistory.jsx',
        'OrderSuccess.jsx', 'ProductDetails.jsx', 'Profile.jsx', 'Register.jsx',
        'ResetPassword.jsx', 'Shop.jsx', 'VerifyEmail.jsx'
    ];

    function updateImports(content) {
        return content.replace(/from\s+['"]\.\.\//g, "from '../../");
    }

    // Move Client Files
    clientFiles.forEach(file => {
        const oldPath = path.join(pagesDir, file);
        if (fs.existsSync(oldPath)) {
            let content = fs.readFileSync(oldPath, 'utf8');
            content = updateImports(content);
            fs.writeFileSync(path.join(clientDir, file), content);
            fs.unlinkSync(oldPath);
            console.log(`Moved ${file} to client/`);
        } else {
            console.log(`Skipping ${file} (not found)`);
        }
    });

    // Update Admin Files
    if (fs.existsSync(adminDir)) {
        const adminFiles = fs.readdirSync(adminDir).filter(f => f.endsWith('.jsx'));
        adminFiles.forEach(file => {
            const filePath = path.join(adminDir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            if (!content.includes("from '../../")) {
                content = updateImports(content);
                fs.writeFileSync(filePath, content);
                console.log(`Updated imports in admin/${file}`);
            }
        });
    }

    // Update App.jsx
    const appPath = path.join(__dirname, 'src', 'App.jsx');
    if (fs.existsSync(appPath)) {
        let appContent = fs.readFileSync(appPath, 'utf8');

        clientFiles.forEach(file => {
            const name = path.basename(file, '.jsx');
            const regex = new RegExp(`import\\s+${name}\\s+from\\s+['"]\\./pages/${name}['"]`, 'g');
            appContent = appContent.replace(regex, `import ${name} from './pages/client/${name}'`);
        });

        const adminFileNames = [
            'AdminCategories', 'AdminDashboard', 'AdminLogin', 'AdminOrders',
            'AdminProducts', 'AdminSettings', 'AdminUsers'
        ];

        adminFileNames.forEach(name => {
            const regex = new RegExp(`import\\s+${name}\\s+from\\s+['"]\\./pages/${name}['"]`, 'g');
            appContent = appContent.replace(regex, `import ${name} from './pages/admin/${name}'`);
        });

        fs.writeFileSync(appPath, appContent);
        console.log('App.jsx updated');
    }

} catch (error) {
    console.error('Error:', error);
    process.exit(1);
}
