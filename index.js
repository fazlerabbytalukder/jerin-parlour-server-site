const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;



//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cnnr8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);

async function run() {
    try {
        await client.connect();
        // console.log('database connect successfully');
        const database = client.db("jerinPalour");
        const servicesCollection = database.collection("services");
        const reviewCollection = database.collection("reviews");
        const usersCollection = database.collection("users");
        const BookingCollection = database.collection("booking");

        //SERVICES DATA SHOW
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        //GET API With id
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })
        //POST BOOKING DATA
        app.post('/booking', async (req, res) => {
            //ei comment diye dekha databackend e aise kina
            // const booking = req.body;
            // console.log(booking);
            // res.json({message:'hello'})

            const booking = req.body;
            const result = await BookingCollection.insertOne(booking);
            // console.log(result);
            res.json(result)
        })
        //GET BOOKING SPECIFIC USER DATA
        app.get('/booking', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = BookingCollection.find(query);       
            const booking = await cursor.toArray();
            res.json(booking);
        })
        //POST REVIEW DATA
        app.post('/reviews', async (req, res) => {
            const reviews = req.body;
            console.log(reviews);
            const result = await reviewCollection.insertOne(reviews);
            // console.log(result);
            res.json(result)
        })
        //REVIEW DATA SHOW
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        //USER INFO POST TO THE DATABASE
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result)
        })
        //USER PUT FOR GOOGLE SIGN IN METHOD(upsert)
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('i am from jerin palour server');
})

app.listen(port, () => {
    console.log('running server on port', port);
})