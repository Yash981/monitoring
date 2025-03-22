import express from "express";
import client from "prom-client";
import { requestCountMiddleware } from "./middleware";
export const requestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});
export const activeRequestsGauge = new client.Gauge({
    name: 'active_requests',
    help: 'Number of active requests',
});
export const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000] 
})
const app = express();

app.use(express.json());


app.use(requestCountMiddleware)
app.get("/user",async (req, res) => {
    // for (let i = 0; i < 1000000000; i++) {
    //     continue
    // }
    await new Promise((resolve,reject)=>{setTimeout(()=>{resolve(true)},1000)})
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