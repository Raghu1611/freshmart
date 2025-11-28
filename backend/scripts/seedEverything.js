import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Category from './models/Category.js';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config({ path: './backend/.env' });

const allCategories = [
    { name: 'Vegetables', description: 'Fresh organic vegetables' },
    { name: 'Fruits', description: 'Fresh seasonal fruits' },
    { name: 'Dairy', description: 'Fresh dairy products and milk' },
    { name: 'Fresh Meat', description: 'Premium quality fresh meat' },
    { name: 'Seafood', description: 'Fresh seafood and fish' },
    { name: 'Bakery', description: 'Freshly baked goods' },
    { name: 'Beverages', description: 'Refreshing drinks and beverages' },
    { name: 'Food', description: 'Packaged and ready-to-eat food' },
    { name: 'Snacks', description: 'Tasty snacks and treats' },
    { name: 'Frozen Foods', description: 'Frozen meals and ingredients' },
    { name: 'Smartphones', description: 'Latest smartphones and devices' },
    { name: 'Electronic Gadgets', description: 'Modern electronic gadgets' },
    { name: 'Other', description: 'Other essentials' }
];

const getPexelsImage = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=400`;

const products = [
    // Vegetables
    {
        name: 'Fresh Tomato',
        price: 2.49,
        originalPrice: 3.0,
        description: 'Fresh and juicy organic tomatoes, perfect for salads and cooking.',
        category: 'Vegetables',
        stock: 100,
        unit: '1 kg',
        images: [
            getPexelsImage(53588),
            getPexelsImage(1327838),
            getPexelsImage(1367242),
            getPexelsImage(533280)
        ]
    },
    {
        name: 'Organic Carrots',
        price: 1.99,
        originalPrice: 2.49,
        description: 'Crunchy organic carrots ideal for snacking, juicing, and cooking.',
        category: 'Vegetables',
        stock: 80,
        unit: '1 kg',
        images: [
            getPexelsImage(143133),
            getPexelsImage(1306559),
            getPexelsImage(65174),
            getPexelsImage(2286776)
        ]
    },
    {
        name: 'Fresh Spinach Leaves',
        price: 1.49,
        originalPrice: 1.99,
        description: 'Tender green spinach leaves perfect for salads and curries.',
        category: 'Vegetables',
        stock: 120,
        unit: '250 g',
        images: [
            getPexelsImage(2325843),
            getPexelsImage(1351238),
            getPexelsImage(594146),
            getPexelsImage(1640777)
        ]
    },
    {
        name: 'Broccoli Crown',
        price: 2.29,
        originalPrice: 2.79,
        description: 'Fresh broccoli crown rich in vitamins and fiber.',
        category: 'Vegetables',
        stock: 70,
        unit: '500 g',
        images: [
            getPexelsImage(47347),
            getPexelsImage(1359326),
            getPexelsImage(257794),
            getPexelsImage(76597)
        ]
    },
    {
        name: 'Red Bell Pepper',
        price: 1.59,
        originalPrice: 1.99,
        description: 'Crisp red bell peppers great for stir-fries and salads.',
        category: 'Vegetables',
        stock: 90,
        unit: '1 pc',
        images: [
            getPexelsImage(302549),
            getPexelsImage(1434259),
            getPexelsImage(2893635),
            getPexelsImage(1656666)
        ]
    },
    // Fruits
    {
        name: 'Bananas',
        price: 1.29,
        originalPrice: 1.59,
        description: 'Sweet ripe bananas perfect for snacking and smoothies.',
        category: 'Fruits',
        stock: 150,
        unit: '1 kg',
        images: [
            getPexelsImage(2872755),
            getPexelsImage(61127),
            getPexelsImage(1093038),
            getPexelsImage(5966630)
        ]
    },
    {
        name: 'Red Apples',
        price: 2.99,
        originalPrice: 3.49,
        description: 'Crisp red apples with a naturally sweet flavor.',
        category: 'Fruits',
        stock: 110,
        unit: '1 kg',
        images: [
            getPexelsImage(209439),
            getPexelsImage(102104),
            getPexelsImage(1510392),
            getPexelsImage(39803)
        ]
    },
    {
        name: 'Seedless Grapes',
        price: 3.49,
        originalPrice: 3.99,
        description: 'Juicy seedless grapes perfect for snacking.',
        category: 'Fruits',
        stock: 95,
        unit: '500 g',
        images: [
            getPexelsImage(708777),
            getPexelsImage(60021),
            getPexelsImage(760281),
            getPexelsImage(1113653)
        ]
    },
    {
        name: 'Oranges',
        price: 2.19,
        originalPrice: 2.69,
        description: 'Fresh oranges rich in vitamin C.',
        category: 'Fruits',
        stock: 130,
        unit: '1 kg',
        images: [
            getPexelsImage(327098),
            getPexelsImage(691166),
            getPexelsImage(207085),
            getPexelsImage(2294477)
        ]
    },
    {
        name: 'Strawberries Box',
        price: 3.99,
        originalPrice: 4.49,
        description: 'Fresh strawberries perfect for desserts and smoothies.',
        category: 'Fruits',
        stock: 60,
        unit: '250 g',
        images: [
            getPexelsImage(70746),
            getPexelsImage(6944172),
            getPexelsImage(134877),
            getPexelsImage(46174)
        ]
    },
    // Smartphones
    {
        name: 'Smartphone One X',
        price: 499.99,
        originalPrice: 549.99,
        description: '6.5-inch display, 128GB storage, dual camera smartphone.',
        category: 'Smartphones',
        stock: 40,
        unit: '1 unit',
        images: [
            getPexelsImage(607812),
            getPexelsImage(1092644),
            getPexelsImage(404280),
            getPexelsImage(788946)
        ]
    },
    {
        name: 'Smartphone Pro Max',
        price: 899.99,
        originalPrice: 999.99,
        description: 'Flagship smartphone with triple camera and OLED display.',
        category: 'Smartphones',
        stock: 25,
        unit: '1 unit',
        images: [
            getPexelsImage(788946),
            getPexelsImage(47261),
            getPexelsImage(6991279),
            getPexelsImage(1294886)
        ]
    },
    {
        name: 'Smartphone Lite',
        price: 299.99,
        originalPrice: 349.99,
        description: 'Affordable smartphone with long-lasting battery.',
        category: 'Smartphones',
        stock: 60,
        unit: '1 unit',
        images: [
            getPexelsImage(404280),
            getPexelsImage(887751),
            getPexelsImage(196644),
            getPexelsImage(607812)
        ]
    },
    {
        name: 'Gaming Smartphone',
        price: 649.99,
        originalPrice: 699.99,
        description: 'High-refresh-rate display and powerful processor for gaming.',
        category: 'Smartphones',
        stock: 30,
        unit: '1 unit',
        images: [
            getPexelsImage(399161),
            getPexelsImage(1092644),
            getPexelsImage(1786433),
            getPexelsImage(3707744)
        ]
    },
    {
        name: 'Compact Smartphone Mini',
        price: 379.99,
        originalPrice: 429.99,
        description: 'Compact smartphone with 5.4-inch display and great camera.',
        category: 'Smartphones',
        stock: 35,
        unit: '1 unit',
        images: [
            getPexelsImage(6078123),
            getPexelsImage(404280),
            getPexelsImage(788946),
            getPexelsImage(3799123)
        ]
    },
    // Electronic Gadgets
    {
        name: 'Wireless Headphones',
        price: 79.99,
        originalPrice: 99.99,
        description: 'Over-ear wireless headphones with noise cancellation.',
        category: 'Electronic Gadgets',
        stock: 50,
        unit: '1 unit',
        images: [
            getPexelsImage(3394650),
            getPexelsImage(1649771),
            getPexelsImage(1037992),
            getPexelsImage(3587478)
        ]
    },
    {
        name: 'Smartwatch Active',
        price: 149.99,
        originalPrice: 179.99,
        description: 'Fitness-focused smartwatch with heart-rate monitoring.',
        category: 'Electronic Gadgets',
        stock: 45,
        unit: '1 unit',
        images: [
            getPexelsImage(267394),
            getPexelsImage(437037),
            getPexelsImage(1104768),
            getPexelsImage(277319)
        ]
    },
    {
        name: 'Bluetooth Speaker',
        price: 39.99,
        originalPrice: 49.99,
        description: 'Portable Bluetooth speaker with deep bass.',
        category: 'Electronic Gadgets',
        stock: 70,
        unit: '1 unit',
        images: [
            getPexelsImage(1706694),
            getPexelsImage(1034653),
            getPexelsImage(157534),
            getPexelsImage(374877)
        ]
    },
    {
        name: 'Wireless Mouse',
        price: 19.99,
        originalPrice: 24.99,
        description: 'Ergonomic wireless mouse with adjustable DPI.',
        category: 'Electronic Gadgets',
        stock: 100,
        unit: '1 unit',
        images: [
            getPexelsImage(2115256),
            getPexelsImage(392018),
            getPexelsImage(4158),
            getPexelsImage(2115257)
        ]
    },
    {
        name: 'USBC Power Bank',
        price: 29.99,
        originalPrice: 34.99,
        description: '10,000 mAh power bank with fast charging.',
        category: 'Electronic Gadgets',
        stock: 85,
        unit: '1 unit',
        images: [
            getPexelsImage(4072683),
            getPexelsImage(3945638),
            getPexelsImage(4526425),
            getPexelsImage(4072689)
        ]
    },
    // Food
    {
        name: 'Cheese Burger Meal',
        price: 5.99,
        originalPrice: 6.99,
        description: 'Grilled cheeseburger served with fries.',
        category: 'Food',
        stock: 40,
        unit: '1 plate',
        images: [
            getPexelsImage(1639557),
            getPexelsImage(1199957),
            getPexelsImage(1633578),
            getPexelsImage(1251198)
        ]
    },
    {
        name: 'Margherita Pizza',
        price: 7.99,
        originalPrice: 8.99,
        description: 'Classic margherita pizza with fresh basil.',
        category: 'Food',
        stock: 35,
        unit: '1 pc',
        images: [
            getPexelsImage(315755),
            getPexelsImage(1049620),
            getPexelsImage(825661),
            getPexelsImage(2619967)
        ]
    },
    {
        name: 'Veggie Salad Bowl',
        price: 4.99,
        originalPrice: 5.49,
        description: 'Colorful salad with fresh veggies and dressing.',
        category: 'Food',
        stock: 50,
        unit: '1 bowl',
        images: [
            getPexelsImage(1059905),
            getPexelsImage(1211887),
            getPexelsImage(2097090),
            getPexelsImage(1640777)
        ]
    },
    {
        name: 'Chicken Pasta',
        price: 6.49,
        originalPrice: 7.29,
        description: 'Creamy chicken pasta with herbs.',
        category: 'Food',
        stock: 45,
        unit: '1 plate',
        images: [
            getPexelsImage(1279330),
            getPexelsImage(1437267),
            getPexelsImage(803963),
            getPexelsImage(1487511)
        ]
    },
    {
        name: 'Chocolate Donut Pack',
        price: 3.49,
        originalPrice: 3.99,
        description: 'Pack of 4 chocolate-glazed donuts.',
        category: 'Food',
        stock: 55,
        unit: '4 pcs',
        images: [
            getPexelsImage(3338681),
            getPexelsImage(867452),
            getPexelsImage(1191639),
            getPexelsImage(377903)
        ]
    },
    // Dairy
    {
        name: 'Fresh Whole Milk',
        price: 1.19,
        originalPrice: 1.39,
        description: 'Pasteurized whole milk rich in calcium.',
        category: 'Dairy',
        stock: 80,
        unit: '1 L',
        images: [
            'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/5946720/pexels-photo-5946720.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/416471/pexels-photo-416471.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
    },
    {
        name: 'Salted Butter',
        price: 2.49,
        originalPrice: 2.99,
        description: 'Creamy salted butter, perfect for baking and cooking.',
        category: 'Dairy',
        stock: 60,
        unit: '200 g',
        images: [
            'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/94443/pexels-photo-94443.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/531321/pexels-photo-531321.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=400'
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
        name: 'Mozzarella Cheese',
        price: 5.99,
        originalPrice: 7.49,
        description: 'Fresh mozzarella cheese',
        category: 'Dairy',
        stock: 70,
        unit: '8 oz',
        images: [
            'https://images.pexels.com/photos/4109998/pexels-photo-4109998.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1435706/pexels-photo-1435706.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/1878898/pexels-photo-1878898.jpeg?auto=compress&cs=tinysrgb&w=400',
            'https://images.pexels.com/photos/4109998/pexels-photo-4109998.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
    }
    ,
    // Fresh Meat
    {
        name: 'Fresh Chicken Breast',
        price: 5.99,
        originalPrice: 6.99,
        description: 'Boneless, skinless chicken breast perfect for daily cooking.',
        category: 'Fresh Meat',
        stock: 80,
        unit: '500 g',
        images: [
            getPexelsImage(616353),
            getPexelsImage(106343),
            getPexelsImage(236010),
            getPexelsImage(416471)
        ]
    },
    {
        name: 'Fresh Mutton Curry Cut',
        price: 8.49,
        originalPrice: 9.49,
        description: 'Tender mutton pieces ideal for rich curries.',
        category: 'Fresh Meat',
        stock: 60,
        unit: '500 g',
        images: [
            getPexelsImage(65175),
            getPexelsImage(410648),
            getPexelsImage(323682),
            getPexelsImage(616354)
        ]
    },
    {
        name: 'Fresh Chicken Drumsticks',
        price: 4.99,
        originalPrice: 5.49,
        description: 'Juicy drumsticks for frying and grilling.',
        category: 'Fresh Meat',
        stock: 90,
        unit: '500 g',
        images: [
            getPexelsImage(106344),
            getPexelsImage(236011),
            getPexelsImage(416472),
            getPexelsImage(616355)
        ]
    },
    {
        name: 'Fresh Beef Steak',
        price: 9.99,
        originalPrice: 11.49,
        description: 'Premium beef steak cuts.',
        category: 'Fresh Meat',
        stock: 40,
        unit: '400 g',
        images: [
            getPexelsImage(65176),
            getPexelsImage(410649),
            getPexelsImage(323683),
            getPexelsImage(616356)
        ]
    },
    {
        name: 'Fresh Minced Chicken',
        price: 4.49,
        originalPrice: 4.99,
        description: 'Minced chicken for kebabs and patties.',
        category: 'Fresh Meat',
        stock: 75,
        unit: '500 g',
        images: [
            getPexelsImage(106345),
            getPexelsImage(236012),
            getPexelsImage(416473),
            getPexelsImage(616357)
        ]
    },

    // Seafood
    {
        name: 'Fresh Salmon Fillet',
        price: 7.49,
        originalPrice: 8.99,
        description: 'Flaky salmon fillet for baking or grilling.',
        category: 'Seafood',
        stock: 50,
        unit: '400 g',
        images: [
            getPexelsImage(3655916),
            getPexelsImage(1683545),
            getPexelsImage(842142),
            getPexelsImage(3763847)
        ]
    },
    {
        name: 'Fresh Rohu Fish Cut',
        price: 4.99,
        originalPrice: 5.49,
        description: 'Cleaned rohu pieces for curries.',
        category: 'Seafood',
        stock: 70,
        unit: '500 g',
        images: [
            getPexelsImage(2638026),
            getPexelsImage(3296279),
            getPexelsImage(3296280),
            getPexelsImage(3655917)
        ]
    },
    {
        name: 'Fresh Prawns (Medium)',
        price: 6.99,
        originalPrice: 7.99,
        description: 'Deveined prawns ready to cook.',
        category: 'Seafood',
        stock: 65,
        unit: '300 g',
        images: [
            getPexelsImage(566345),
            getPexelsImage(699953),
            getPexelsImage(2871496),
            getPexelsImage(3763848)
        ]
    },
    {
        name: 'Fresh Pomfret Whole',
        price: 9.49,
        originalPrice: 10.49,
        description: 'Whole pomfret fish.',
        category: 'Seafood',
        stock: 35,
        unit: '2 pieces',
        images: [
            getPexelsImage(1683546),
            getPexelsImage(842143),
            getPexelsImage(2638027),
            getPexelsImage(3655918)
        ]
    },
    {
        name: 'Fresh Catla Fish Slices',
        price: 5.49,
        originalPrice: 5.99,
        description: 'Thick catla slices for gravies.',
        category: 'Seafood',
        stock: 55,
        unit: '500 g',
        images: [
            getPexelsImage(3296281),
            getPexelsImage(566346),
            getPexelsImage(699954),
            getPexelsImage(3763849)
        ]
    },

    // Bakery
    {
        name: 'Whole Wheat Bread Loaf',
        price: 2.49,
        originalPrice: 2.99,
        description: 'Soft whole wheat bread.',
        category: 'Bakery',
        stock: 50,
        unit: '1 loaf',
        images: [
            getPexelsImage(209206),
            getPexelsImage(1775043),
            getPexelsImage(1079020),
            getPexelsImage(1586947)
        ]
    },
    {
        name: 'Butter Croissants',
        price: 3.49,
        originalPrice: 3.99,
        description: 'Flaky, buttery croissants.',
        category: 'Bakery',
        stock: 40,
        unit: '4 pcs',
        images: [
            getPexelsImage(3724),
            getPexelsImage(2135),
            getPexelsImage(357573),
            getPexelsImage(887853)
        ]
    },
    {
        name: 'Chocolate Muffins',
        price: 2.99,
        originalPrice: 3.49,
        description: 'Soft chocolate muffins.',
        category: 'Bakery',
        stock: 45,
        unit: '4 pcs',
        images: [
            getPexelsImage(3081657),
            getPexelsImage(377903),
            getPexelsImage(1055272),
            getPexelsImage(1055271)
        ]
    },
    {
        name: 'Garlic Bread Sticks',
        price: 1.99,
        originalPrice: 2.49,
        description: 'Crispy garlic bread sticks.',
        category: 'Bakery',
        stock: 60,
        unit: '6 pcs',
        images: [
            getPexelsImage(923182),
            getPexelsImage(1775038),
            getPexelsImage(1586942),
            getPexelsImage(209201)
        ]
    },
    {
        name: 'Multigrain Sandwich Bread',
        price: 2.79,
        originalPrice: 3.29,
        description: 'Nutritious multigrain bread.',
        category: 'Bakery',
        stock: 35,
        unit: '1 loaf',
        images: [
            getPexelsImage(1775040),
            getPexelsImage(1079022),
            getPexelsImage(1586945),
            getPexelsImage(209204)
        ]
    },

    // Beverages
    {
        name: 'Fresh Orange Juice',
        price: 3.99,
        originalPrice: 4.49,
        description: 'Chilled orange juice.',
        category: 'Beverages',
        stock: 70,
        unit: '1 L',
        images: [
            getPexelsImage(1337825),
            getPexelsImage(1233319),
            getPexelsImage(96974),
            getPexelsImage(1194030)
        ]
    },
    {
        name: 'Cold Coffee Bottle',
        price: 2.49,
        originalPrice: 2.99,
        description: 'Ready-to-drink cold coffee.',
        category: 'Beverages',
        stock: 80,
        unit: '300 ml',
        images: [
            getPexelsImage(302899),
            getPexelsImage(374885),
            getPexelsImage(2615323),
            getPexelsImage(1194031)
        ]
    },
    {
        name: 'Strawberry Smoothie',
        price: 3.99,
        originalPrice: 4.49,
        description: 'Thick and creamy strawberry smoothie.',
        category: 'Beverages',
        stock: 50,
        unit: '300 ml',
        images: [
            getPexelsImage(792613),
            getPexelsImage(3625372),
            getPexelsImage(845552),
            getPexelsImage(1194032)
        ]
    },
    {
        name: 'Green Tea Pack',
        price: 5.99,
        originalPrice: 6.99,
        description: 'Organic green tea bags.',
        category: 'Beverages',
        stock: 100,
        unit: '25 bags',
        images: [
            getPexelsImage(1417945),
            getPexelsImage(1793035),
            getPexelsImage(461428),
            getPexelsImage(1194033)
        ]
    },
    {
        name: 'Sparkling Water',
        price: 1.49,
        originalPrice: 1.99,
        description: 'Refreshing sparkling water.',
        category: 'Beverages',
        stock: 120,
        unit: '500 ml',
        images: [
            getPexelsImage(416528),
            getPexelsImage(1187766),
            getPexelsImage(1000084),
            getPexelsImage(1194034)
        ]
    },

    // Other
    {
        name: 'Reusable Grocery Bag',
        price: 1.99,
        originalPrice: 2.49,
        description: 'Eco-friendly reusable grocery bag for carrying daily essentials.',
        category: 'Other',
        stock: 150,
        unit: '1 piece',
        images: [
            getPexelsImage(105001),
            getPexelsImage(105002),
            getPexelsImage(105003),
            getPexelsImage(105004)
        ]
    }
];

const seedAllProducts = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://2200032009cseh_db_user:Raghu1611@cluster0.xrextg2.mongodb.net/auth_app';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB\n');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Category.deleteMany({});
        await Product.deleteMany({});
        console.log('✅ Old data cleared\n');

        // Create all categories
        console.log('📁 Creating categories...');
        for (const cat of allCategories) {
            await Category.create(cat);
            console.log(`  ✅ Created category: ${cat.name}`);
        }

        console.log('\n🛍️  Creating products with curated images...\n');
        let totalCreated = 0;

        for (const product of products) {
            await Product.create({
                ...product,
                imageUrl: product.images[0] // Set primary image
            });
            console.log(`  ✅ Created: ${product.name}`);
            totalCreated++;
        }

        // Create Admin User (ONLY IF NOT EXISTS - PERMANENT)
        console.log('\n👤 Checking admin user...');
        const adminEmail = 'admin@freshmart.com';
        const adminPassword = 'admin123';

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('✅ Admin already exists - keeping permanent credentials\n');
        } else {
            const admin = new User({
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                isVerified: true
            });
            await admin.save();
            console.log('✅ Admin user created successfully\n');
        }

        console.log('\n' + '='.repeat(50));
        console.log('✅ Seeding completed successfully!');
        console.log(`📊 Summary:`);
        console.log(`   - Categories: ${allCategories.length}`);
        console.log(`   - Products created: ${totalCreated}`);
        console.log('='.repeat(50) + '\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        process.exit(1);
    }
};

seedAllProducts();
