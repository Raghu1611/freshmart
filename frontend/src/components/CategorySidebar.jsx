import React from 'react';
import {
    Carrot,
    Apple,
    Milk,
    Beef,
    Fish,
    Croissant,
    Coffee,
    Utensils,
    ChevronRight
} from 'lucide-react';

const categories = [
    { name: 'Fresh Vegetables', icon: Carrot },
    { name: 'Diet Foods', icon: Apple },
    { name: 'Diet Nutrition', icon: Apple }, // Using Apple as placeholder
    { name: 'Fast Food Items', icon: Utensils },
    { name: 'Quality Milk', icon: Milk },
    { name: 'Fruits Items', icon: Apple },
    { name: 'Healthy Foods', icon: Apple }, // Placeholder
    { name: 'Grocery Items', icon: Carrot }, // Placeholder
    { name: 'Cold Drinks', icon: Coffee },
    { name: 'Steak Store', icon: Beef },
    { name: 'Chicken Items', icon: Utensils }, // Placeholder
    { name: 'Fish Items', icon: Fish },
];

const CategorySidebar = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden w-full">
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {categories.map((category, index) => (
                    <li key={index} className="group">
                        <a
                            href="#"
                            className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                        >
                            <div className="flex items-center gap-3">
                                <category.icon className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    {category.name}
                                </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary-600 transition-colors" />
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategorySidebar;
