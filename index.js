const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json()); 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ndi3mbc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
         const serviceCollection = client.db('Assignment11').collection('service');
        const reviewCollection = client.db('Assignment11').collection('review');
        //Services Part
        app.post('/services', async (req, res) => {
            const service = req.body; 
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        });
        app.get('/services', async (req, res) => {
            let query = {};
            const cursor = serviceCollection.find(query).limit(3);
            const serve = await cursor.toArray();
            res.send(serve);
        });
        app.get('/servicess', async (req, res) => {
            let query = {};
            const cursor = serviceCollection.find(query);
            const serve = await cursor.toArray();
            res.send(serve);
        });
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        
        //Review Part email
        app.get('/reviews', async (req, res) => {
            let query = {};

            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
        });

        //review by id
        app.get('/reviewss', async (req, res) => {
            let query = {};

            if (req.query.service) {
                query = {
                    service: req.query.service
                }
            }
            const cursor = reviewCollection.find(query).limit(0).sort({$natural:-1}) 
            const review = await cursor.toArray();
            res.send(review);
        });


        //review update
        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set:{
                    status: status
                }
            }
            const result = await reviewCollection.updateOne(query, updatedDoc);
            res.send(result);
        })

        //review delete
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });

        
        



    }
    finally{

    }
}

run().catch(err => console.error(err))


app.get('/',(req,res)=>{
    res.send('Photography server is running')
})

app.listen(port, ()=>{
    console.log(`Photography server is running${port}`)
})