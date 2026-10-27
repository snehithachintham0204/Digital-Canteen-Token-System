
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const menu = [
  { id: 1, name: 'Idli', price: 30, category: 'Breakfast' },
  { id: 2, name: 'Plain Dosa', price: 40, category: 'Breakfast' },
  { id: 3, name: 'Masala Dosa', price: 50, category: 'Breakfast' },
  { id: 4, name: 'Vada', price: 25, category: 'Breakfast' },
  { id: 5, name: 'Puri', price: 35, category: 'Breakfast' },
  { id: 6, name: 'Upma', price: 30, category: 'Breakfast' },
  { id: 7, name: 'Veg Sandwich', price: 40, category: 'Breakfast' },

  { id: 8, name: 'Veg Biryani', price: 80, category: 'Lunch' },
  { id: 9, name: 'Curd Rice', price: 50, category: 'Lunch' },
  { id: 10, name: 'Lemon Rice', price: 45, category: 'Lunch' },
  { id: 11, name: 'Veg Fried Rice', price: 70, category: 'Lunch' },
  { id: 12, name: 'Veg Noodles', price: 70, category: 'Lunch' },
  { id: 13, name: 'Chicken Biryani', price: 120, category: 'Lunch' },
  { id: 24, name: 'Chicken Dum Biryani', price: 140, category: 'Lunch' },
  { id: 25, name: 'Chicken Fry Biryani', price: 130, category: 'Lunch' },
  { id: 26, name: 'Egg Biryani', price: 90, category: 'Lunch' },

  { id: 14, name: 'Samosa', price: 20, category: 'Snacks' },
  { id: 15, name: 'Veg Puff', price: 25, category: 'Snacks' },
  { id: 16, name: 'Biscuits', price: 10, category: 'Snacks' },

  { id: 17, name: 'Gulab Jamun', price: 30, category: 'Desserts' },
  { id: 18, name: 'Ice Cream', price: 40, category: 'Desserts' },

  { id: 19, name: 'Tea', price: 20, category: 'Drinks' },
  { id: 20, name: 'Coffee', price: 25, category: 'Drinks' },
  { id: 21, name: 'Milk', price: 20, category: 'Drinks' },
  { id: 22, name: 'Badam Milk', price: 35, category: 'Drinks' },
  { id: 23, name: 'Fresh Lime Juice', price: 30, category: 'Drinks' }
];

let orders = [];
let nextToken = 1001;

app.get('/', (req, res) => {
  res.send('Digital Canteen Token System Backend is Running!');
});

app.get('/api/menu', (req, res) => {
  res.json(menu);
});

// Place one food item order
app.post('/api/orders', (req, res) => {
  const {
    studentName,
    branch,
    year,
    rollNumber,
    itemId,
    quantity
  } = req.body || {};

  if (
    typeof studentName !== 'string' ||
    !studentName.trim() ||
    typeof branch !== 'string' ||
    !branch.trim() ||
    typeof year !== 'string' ||
    !year.trim() ||
    typeof rollNumber !== 'string' ||
    !rollNumber.trim()
  ) {
    return res.status(400).json({
      message: 'Please enter your name, branch, year and roll number.'
    });
  }

  const item = menu.find(
    food => food.id === Number(itemId)
  );

  if (!item) {
    return res.status(400).json({
      message: 'Please select a valid food item.'
    });
  }

  const qty = Number(quantity);

  if (!Number.isInteger(qty) || qty < 1) {
    return res.status(400).json({
      message: 'Quantity must be a positive whole number.'
    });
  }

  const order = {
    token: nextToken++,
    studentName: studentName.trim(),
    branch: branch.trim(),
    year: year.trim(),
    rollNumber: rollNumber.trim(),
    itemId: item.id,
    item: item.name,
    quantity: qty,
    price: item.price,
    total: item.price * qty,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  orders.push(order);

  return res.status(201).json({
    message: 'Order placed successfully!',
    order
  });
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.get('/api/orders/:token', (req, res) => {
  const token = Number(req.params.token);

  const order = orders.find(
    item => item.token === token
  );

  if (!order) {
    return res.status(404).json({
      message: 'Order token not found.'
    });
  }

  res.json(order);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(
    `Digital Canteen Backend running at http://localhost:${PORT}`
  );
});
