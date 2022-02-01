import { ServiceRequest } from "./dtos";
import { CosmosClient } from "@azure/cosmos";
import { v4 } from "uuid";

const cosmosClient = new CosmosClient(process.env.COSMOS_CON)
const database = cosmosClient.database("room-service-db");
const container = database.container("service-requests");

export default interface ServiceRequestDAO{

    createServiceRequest(serviceRequest: ServiceRequest):Promise<ServiceRequest>

    getServiceRequests():Promise<ServiceRequest[]>

    getServiceRequestById(id: string):Promise<ServiceRequest>
    
    updateServiceRequest(servoceRequest: ServiceRequest):Promise<ServiceRequest>

}

export class ServiceRequestDaoAzure implements ServiceRequestDAO{

    async createServiceRequest(serviceRequest: ServiceRequest): Promise<ServiceRequest> {
        serviceRequest.id = v4()
        await container.items.upsert(serviceRequest)
        return serviceRequest;
    }
    async getServiceRequests(): Promise<ServiceRequest[]> {
        const response = await container.items.readAll<ServiceRequest>().fetchAll()
        const sr:ServiceRequest[] =  response.resources.map(sr => ({id:sr.id, room:sr.room, created:sr.created, status:sr.status, requestedOfferings:sr.requestedOfferings}))
        return sr
    }
    async getServiceRequestById(sid: string): Promise<ServiceRequest> {
        const response = await container.item(sid,sid).read<ServiceRequest>()
        const {id,status,requestedOfferings,room,created} = response.resource
        return {id,status,requestedOfferings,room,created}
    }
    async updateServiceRequest(serviceRequest: ServiceRequest): Promise<ServiceRequest> {
        await container.items.upsert(serviceRequest);
        return serviceRequest;
    }
    
}