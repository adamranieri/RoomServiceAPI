import express from 'express';
import cors from 'cors'
import { Offering, ServiceRequest } from './dtos';
import ServiceRequestDAO, { ServiceRequestDaoAzure } from './daos';

const app = express()
app.use(express.json())
app.use(cors())

const roomServiceDAO:ServiceRequestDAO = new ServiceRequestDaoAzure();

app.get('/offerings', (req,res)=>{
    const offerings:Offering[] = [
        {desc:"Lobster Bisque", cost:23.5},
        {desc:"Crem Brule", cost:12},
        {desc:"Beef Wellington", cost:42.40},
        {desc:"Hamburger", cost:14},
        {desc:"Tomato Soup", cost:9.99}
    ]
    res.send(offerings)
})

app.get("/servicerequests", async (req,res) => {
    try {
        const rs = await roomServiceDAO.getServiceRequests();
        res.status(200).send(rs)  
    } catch (error) {
        console.log(error)
        res.status(400).send(error)    
    }

})

app.get("/servicerequests/:id", async (req,res) => {
    try {
        const rs = await roomServiceDAO.getServiceRequestById(req.params.id)
        res.status(200).send(rs)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }

})

app.post("/servicerequests", async (req,res) => {
    try {
        const serviceRequest: ServiceRequest = req.body
        serviceRequest.created = Date.now()
        serviceRequest.status = "Ordered";
        await roomServiceDAO.createServiceRequest(serviceRequest)
        res.status(201).send(serviceRequest)      
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }

})

app.patch("/servicerequests/:id", async (req,res) => {
    try {
        const action: {status: "Ordered" | "Processing" | "Completed"} = req.body;
        const sr:ServiceRequest = await roomServiceDAO.getServiceRequestById(req.params.id);
        sr.status = action.status
        await roomServiceDAO.updateServiceRequest(sr)
        res.status(200).send(sr)           
    } catch (error) {
        console.log(error)
        res.status(400).send(error)       
    }

})

app.listen(4000,()=> console.log("Application Started!"))


