import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Category from './models/Category.js';
import Product from './models/Product.js';

dotenv.config();

const additionalCategories = [
    { name: 'Dairy', description: 'Fresh dairy products and milk' },
    { name: 'Fresh Meat', description: 'Premium quality fresh meat' },
    { name: 'Seafood', description: 'Fresh seafood and fish' }
];

const additionalProducts = [
    // Dairy Products
    {
        name: 'Whole Milk',
        price: 3.99,
        originalPrice: 4.99,
        description: 'Fresh whole milk, 1 gallon',
        category: 'Dairy',
        stock: 100,
        unit: '1 gallon',
        images: [
            'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/5946720/pexels-photo-5946720.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/416471/pexels-photo-416471.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
    },
    {
        name: 'Greek Yogurt',
        price: 5.49,
        originalPrice: 6.99,
        description: 'Creamy Greek yogurt, plain',
        category: 'Dairy',
        stock: 80,
        unit: '32 oz',
        images: [
            'https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/414262/pexels-photo-414262.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
    },
    {
        name: 'Cheddar Cheese',
        price: 6.99,
        originalPrice: 8.49,
        description: 'Sharp cheddar cheese block',
        category: 'Dairy',
        stock: 60,
        unit: '16 oz',
        images: [
            'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/416471/pexels-photo-416471.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
    },
    {
        name: 'Butter',
        price: 4.49,
        originalPrice: 5.49,
        description: 'Unsalted butter sticks',
        category: 'Dairy',
        stock: 90,
        unit: '1 lb',
        images: [
            'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/94443/pexels-photo-94443.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/531321/pexels-photo-531321.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
    },
    {
        name: 'Mozzarella Cheese',
        price: 5.99,
        originalPrice: 7.49,
        description: 'Fresh mozzarella cheese',
        category: 'Dairy',
        stock: 70,
        unit: '8 oz',
        images: [
            'https://images.pexels.com/photos/1878898/pexels-photo-1878898.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/4109998/pexels-photo-4109998.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1878898/pexels-photo-1878898.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
    },

    // Fresh Meat Products
    {
        name: 'Chicken Breast',
        price: 8.99,
        originalPrice: 10.99,
        description: 'Boneless skinless chicken breast',
        category: 'Fresh Meat',
        stock: 50,
        unit: '1 lb',
        images: [
            'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
    },
    {
        name: 'Ground Beef',
        price: 7.99,
        originalPrice: 9.49,
        description: 'Lean ground beef, 90/10',
        category: 'Fresh Meat',
        stock: 60,
        unit: '1 lb',
        images: [
            'https://images.pexels.com/photos/3688/food-dinner-lunch-unhealthy.jpg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/65175/pexels-photo-65175.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1881336/pexels-photo-1881336.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/3688/food-dinner-lunch-unhealthy.jpg?auto=compress&cs=tinysrgb&w=400'
        ]
    },
    {
        name: 'Pork Chops',
        price: 9.49,
        originalPrice: 11.99,
        description: 'Bone-in pork chops',
        category: 'Fresh Meat',
        stock: 40,
        unit: '1 lb',
        images: [
            'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/65175/pexels-photo-65175.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
    },
    {
        name: 'Beef Steak',
        price: 14.99,
        originalPrice: 17.99,
        description: 'Premium ribeye steak',
        category: 'Fresh Meat',
        stock: 30,
        unit: '12 oz',
        images: [
            'https://images.pexels.com/photos/1639565/pexels-photo-1639565.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1251198/pexels-photo-1251198.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1881336/pexels-photo-1881336.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1639565/pexels-photo-1639565.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
    },
    {
        name: 'Turkey Breast',
        price: 7.49,
        originalPrice: 9.49,
        description: 'Fresh turkey breast slices',
        category: 'Fresh Meat',
        stock: 45,
        unit: '1 lb',
        images: [
            'https://images.pexels.com/photos/3688/food-dinner-lunch-unhealthy.jpg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/3688/food-dinner-lunch-unhealthy.jpg?auto=compress&cs=tinysrgb&w=400'
        ]
    },

    // Seafood Products
    {
        name: 'Atlantic Salmon',
        price: 12.99,
        originalPrice: 15.99,
        description: 'Fresh Atlantic salmon fillet',
        category: 'Seafood',
        stock: 35,
        unit: '1 lb',
        images: [
            'https://images.pexels.com/photos/1683545/pexels-photo-1683545.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/3296278/pexels-photo-3296278.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1683545/pexels-photo-1683545.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
    },
    {
        name: 'Shrimp',
        price: 11.99,
        originalPrice: 14.49,
        description: 'Large raw shrimp, peeled',
        category: 'Seafood',
        stock: 40,
        unit: '1 lb',
        images: [
            'https://images.pexels.com/photos/566345/pexels-photo-566345.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/699544/pexels-photo-699544.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/8951203/pexels-photo-8951203.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/566345/pexels-photo-566345.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
    },
    {
        name: 'Tuna Steak',
        price: 13.99,
        originalPrice: 16.99,
        description: 'Fresh yellowfin tuna steak',
        category: 'Seafood',
        stock: 25,
        unit: '8 oz',
        images: [
            'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1683545/pexels-photo-1683545.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
    },
    {
        name: 'Cod Fillet',
        price: 10.49,
        originalPrice: 12.99,
        description: 'Wild-caught cod fillet',
        category: 'Seafood',
        stock: 30,
        unit: '1 lb',
        images: [
            'https://images.pexels.com/photos/1683545/pexels-photo-1683545.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/3296278/pexels-photo-3296278.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1683545/pexels-photo-1683545.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
    },
    {
        name: 'Lobster Tail',
        price: 19.99,
        originalPrice: 24.99,
        description: 'Premium lobster tail',
        category: 'Seafood',
        stock: 20,
        unit: '6 oz',
        images: [
            'https://images.pexels.com/photos/566345/pexels-photo-566345.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/699544/pexels-photo-699544.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/8951203/pexels-photo-8951203.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/566345/pexels-photo-566345.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
    }
];

const seedAdditionalProducts = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Create categories
        console.log('\n📁 Creating additional categories...');
        for (const cat of additionalCategories) {
            const existing = await Category.findOne({ name: cat.name });
            if (!existing) {
                await Category.create(cat);
                console.log(`✅ Created category: ${cat.name}`);
            } else {
                console.log(`⏭️  Category already exists: ${cat.name}`);
            }
        }

        // Create products
        console.log('\n🛍️  Creating additional products...');
        for (const product of additionalProducts) {
            const category = await Category.findOne({ name: product.category });
            if (!category) {
                console.log(`❌ Category not found for product: ${product.name}`);
                continue;
            }

            const existing = await Product.findOne({ name: product.name });
            if (!existing) {
                await Product.create({ ...product, category: category._id });
                console.log(`✅ Created product: ${product.name}`);
            } else {
                console.log(`⏭️  Product already exists: ${product.name}`);
            }
        }

        console.log('\n✅ Additional products seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding additional products:', error);
        process.exit(1);
    }
};

seedAdditionalProducts();
