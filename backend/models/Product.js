import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        maxLength: [5, 'Product price cannot exceed 5 characters'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Please enter product description'],
    },
    category: {
        type: String,
        required: [true, 'Please select product category'],
        enum: {
            values: [
                'Vegetables',
                'Fruits',
                'Dairy',
                'Fresh Meat',
                'Seafood',
                'Bakery',
                'Beverages',
                'Food',
                'Snacks',
                'Frozen Foods',
                'Smartphones',
                'Electronic Gadgets',
                'Other'
            ],
            message: 'Please select correct category for product'
        }
    },
    unit: {
        type: String,
        required: [true, 'Please enter product unit (e.g., 1 kg, 12 ct)'],
        default: '1 each'
    },
    originalPrice: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        maxLength: [5, 'Product stock cannot exceed 5 characters'],
        default: 0
    },
    imageUrl: {
        type: String,
        // required: [true, 'Please upload product image'] // Made optional as we move to images array
    },
    images: [String],
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    priceAlertSubscribers: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            },
            email: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

export default mongoose.model('Product', productSchema);
