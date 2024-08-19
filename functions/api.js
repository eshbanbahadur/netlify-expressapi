require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Sample Schema and Model
const itemSchema = new mongoose.Schema({
    name: String,
});

const Item = mongoose.model('Item', itemSchema);

// Sample GET API
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Sample POST API
app.post('/api/items', async (req, res) => {
    const item = new Item({
        name: req.body.name,
    });

    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Export the app as a serverless function
module.exports.handler = serverless(app);

// import express from "express";
// import ServerlessHttp from "serverless-http";

// const app = express();


// app.get('/.netlify/functions/api', (req, res) => {
//     return res.json({
//         messages: "hello world!"
//     })
// })


// const handler = ServerlessHttp(app);

// module.exports.handler = async(event, context) => {
//     const result = await handler(event, context);
//     return result;
// }
