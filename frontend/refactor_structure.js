const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const adminDir = path.join(pagesDir, 'admin');
const clientDir = path.join(pagesDir, 'client');

// Directories should already exist now

const adminFiles = [
    'AdminCategories.jsx',
    'AdminDashboard.jsx',
    'AdminLogin.jsx',
    'AdminOrders.jsx',
    'AdminProducts.jsx',
    'AdminSettings.jsx',
    'AdminUsers.jsx'
];

const clientFiles = [
    'About.jsx',
    'Cart.jsx',
    'Checkout.jsx',
    'Contact.jsx',
    'Dashboard.jsx',
    'ForgotPassword.jsx',
    'Home.jsx',
    'Login.jsx',
    'Menu.jsx',
    'OrderHistory.jsx',
    'OrderSuccess.jsx',
    'ProductDetails.jsx',
    'Profile.jsx',
    'Register.jsx',
    'ResetPassword.jsx',
    'Shop.jsx',
    'VerifyEmail.jsx'
];

function updateImports(content) {
    return content.replace(/from\s+['"]\.\.\//g, "from '../../");
}

try {
    // Move Admin Files
    adminFiles.forEach(file => {
        const oldPath = path.join(pagesDir, file);
        if (fs.existsSync(oldPath)) {
            let content = fs.readFileSync(oldPath, 'utf8');
            content = updateImports(content);
            fs.writeFileSync(path.join(adminDir, file), content);
            fs.unlinkSync(oldPath);
            console.log(`Moved ${file} to admin/`);
        } else {
            console.log(`Skipping ${file} (not found)`);
        }
    });

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

    // Update App.jsx
    const appPath = path.join(__dirname, 'src', 'App.jsx');
    if (fs.existsSync(appPath)) {
        let appContent = fs.readFileSync(appPath, 'utf8');

        // Update Admin imports
        adminFiles.forEach(file => {
            const name = path.basename(file, '.jsx');
            const regex = new RegExp(`import\\s+${name}\\s+from\\s+['"]\\./pages/${name}['"]`, 'g');
            appContent = appContent.replace(regex, `import ${name} from './pages/admin/${name}'`);
        });

        // Update Client imports
        clientFiles.forEach(file => {
            const name = path.basename(file, '.jsx');
            const regex = new RegExp(`import\\s+${name}\\s+from\\s+['"]\\./pages/${name}['"]`, 'g');
            appContent = appContent.replace(regex, `import ${name} from './pages/client/${name}'`);
        });

        fs.writeFileSync(appPath, appContent);
        console.log('App.jsx updated');
    } else {
        console.error('App.jsx not found');
    }

} catch (error) {
    console.error('An error occurred:', error);
}
