export type AnnouncementWrapper = {
    announcements: TrafficAnnouncement[]
}

export type TrafficAnnouncement = {
    id?: string
    title?: string
    announcementType?: string
    startTime?: any
    endTime?: any
    estimatedDuration?: string
    announcementFeatures: string[]
    municipality?: string
    geometry: number[][]

}