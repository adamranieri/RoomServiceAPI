export interface ServiceRequest{
    id: string
    room: string
    created: number
    status: "Ordered" | "Processing" | "Completed"
    requestedOfferings: Offering[]
}

export interface Offering{
    desc: string
    cost: number
}

