import express from "express";
import client from "prom-client";
import { requestCountMiddleware } from "./middleware";
export const requestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});


const app = express();

app.use(express.json());


app.use(requestCountMiddleware)
app.get("/user",async (req, res) => {
    for (let i = 0; i < 1000000000; i++) {
        continue
    }
    res.send({
        name: "John Doe",
        age: 25,
    });
});

app.post("/user", (req, res) => {
    const user = req.body;
    res.send({
        ...user,
        id: 1,
    });
});
app.get("/metrics", async (req, res) => {
    const metrics = await client.register.metrics();
    res.set('Content-Type', client.register.contentType);
    res.end(metrics);
})
app.listen(3000,()=>{
    console.log("Running on port 3000")
});