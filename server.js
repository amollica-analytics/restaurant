// Import packages, initialize an express app, and define the port you will use
const { body, validationResult } = require('express-validator');


const express = require('express');
const app = express();

const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());


// Data for the server
const menuItems = [
  {
    id: 1,
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, and cheese on a sesame seed bun",
    price: 12.99,
    category: "entree",
    ingredients: ["beef", "lettuce", "tomato", "cheese", "bun"],
    available: true
  },
  {
    id: 2,
    name: "Chicken Caesar Salad",
    description: "Grilled chicken breast over romaine lettuce with parmesan and croutons",
    price: 11.50,
    category: "entree",
    ingredients: ["chicken", "romaine lettuce", "parmesan cheese", "croutons", "caesar dressing"],
    available: true
  },
  {
    id: 3,
    name: "Mozzarella Sticks",
    description: "Crispy breaded mozzarella served with marinara sauce",
    price: 8.99,
    category: "appetizer",
    ingredients: ["mozzarella cheese", "breadcrumbs", "marinara sauce"],
    available: true
  },
  {
    id: 4,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 7.99,
    category: "dessert",
    ingredients: ["chocolate", "flour", "eggs", "butter", "vanilla ice cream"],
    available: true
  },
  {
    id: 5,
    name: "Fresh Lemonade",
    description: "House-made lemonade with fresh lemons and mint",
    price: 3.99,
    category: "beverage",
    ingredients: ["lemons", "sugar", "water", "mint"],
    available: true
  },
  {
    id: 6,
    name: "Fish and Chips",
    description: "Beer-battered cod with seasoned fries and coleslaw",
    price: 14.99,
    category: "entree",
    ingredients: ["cod", "beer batter", "potatoes", "coleslaw", "tartar sauce"],
    available: false
  }
];

// Define routes and implement middleware here
// ---------------- MIDDLEWARE ----------------
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log("----- Incoming Request -----");
  console.log("Time:", timestamp);
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);

  if (req.method === "POST" || req.method === "PUT") {
    console.log("Request Body:", req.body);
  }

  console.log("----------------------------");

  next();
};

app.use(requestLogger);

// Validation rules for POST and PUT
const menuValidationRules = [
  body('name')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('description')
    .isString().withMessage('Description must be a string')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price')
    .isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0'),
  body('category')
    .isIn(['appetizer', 'entree', 'dessert', 'beverage']).withMessage('Invalid category'),
  body('ingredients')
    .isArray({ min: 1 }).withMessage('Ingredients must be an array with at least 1 item'),
  body('available')
    .optional()
    .isBoolean().withMessage('Available must be a boolean')
];


// ---------------- ROUTES ----------------

// Root test route
app.get('/', (req, res) => {
  res.send('Restaurant API is running');
});

// GET all menu items
app.get('/api/menu', (req, res) => {
  res.status(200).json(menuItems);
});

// GET single menu item
app.get('/api/menu/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = menuItems.find(menu => menu.id === id);

  if (!item) return res.status(404).json({ message: "Menu item not found" });
  res.status(200).json(item);
});

// POST new menu item
app.post('/api/menu', (req, res) => {
  const newItem = req.body;
  if (!newItem.name || !newItem.price)
    return res.status(400).json({ message: "Name and price are required" });

  newItem.id = menuItems.length + 1;
  menuItems.push(newItem);

  res.status(201).json(newItem);
});

// PUT update menu item
app.put('/api/menu/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = menuItems.find(menu => menu.id === id);

  if (!item) return res.status(404).json({ message: "Menu item not found" });

  Object.assign(item, req.body);
  res.status(200).json(item);
});

// DELETE menu item
app.delete('/api/menu/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = menuItems.findIndex(menu => menu.id === id);

  if (index === -1) return res.status(404).json({ message: "Menu item not found" });

  const deletedItem = menuItems.splice(index, 1);
  res.status(200).json({ message: "Menu item deleted successfully", item: deletedItem[0] });
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});