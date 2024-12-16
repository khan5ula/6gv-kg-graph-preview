import axios from 'axios'
import { TrafficAnnouncement as TrafficAnnouncement } from '../../types/announcementTypes'
import { errorWithTimeStamp, logWithTimestamp } from '../../utils/logWithTimeStamp'

/*Default apiUrl for getting announcements is 'https://tie.digitraffic.fi/api/traffic-message/v1/messages?inactiveHours=0&includeAreaGeometry=false&situationType=TRAFFIC_ANNOUNCEMENT' 
inactiveHours can be changed to get older announcements. Set in .env file.
*/

 /**
 * Gets traffic announcements from the digitraffic API and creates an array of TrafficAnnouncements to be saved in the knowledge graph.
 * @param apiUrl The url used for the request. inactiveHours can be increased to get older announcements that are not active anymore.
 * @author Arttu Myllyneva
 */
export const getTrafficAnnouncements = async (apiUrl: string): Promise<TrafficAnnouncement[]>=> {
    logWithTimestamp('Digi traffic poller: Traffic announcement fetching started')
    try {
    
    let response = ((await axios.get(apiUrl, {
        headers: {
        'Digitraffic-User': 'kg'//API owner asks to use a name, not strictly required
        }    
    })))
    var announcementData: any = response.data
    
    const announcements: TrafficAnnouncement[] = []
    
    //Check to ensure that only announcements relevant to the area of the bounding box are saved into the knowledge graph.
    const validMunicipalities = ['Oulu', 'Kempele', 'Muhos', 'Temmes']
    for (let i = 0; i < announcementData.features.length; i++){{
            if (validMunicipalities.includes(announcementData.features[i].properties.announcements[0]?.locationDetails?.roadAddressLocation?.primaryPoint?.municipality)){
                console.log("found valid municipality\n")
                const announcement: TrafficAnnouncement = {
                    id: announcementData.features[i].properties.situationId,
                    announcementType: announcementData.features[i].properties.trafficAnnouncementType,
                    title: announcementData.features[i].properties.announcements?.[0]?.title ?? "",
                    municipality: announcementData.features[i].properties.announcements?.[0]?.locationDetails?.roadAddressLocation?.primaryPoint?.municipality ?? "",
                    geometry: Array.isArray(announcementData.features[i].geometry.coordinates[0][0])
                        ? announcementData.features[i].geometry.coordinates[0]
                        : [announcementData.features[i].geometry.coordinates],
                    startTime: announcementData.features[i].properties.announcements?.[0]?.timeAndDuration?.startTime ?? "",
                    endTime: announcementData.features[i].properties.announcements?.[0]?.timeAndDuration?.endTime ?? "",
                    estimatedDuration: announcementData.features[i].properties.announcements?.[0]?.timeAndDuration?.estimatedDuration?.minimum ?? "",
                    announcementFeatures: announcementData.features[i].properties.announcements?.[0]?.features?.map((feature: { name: string }) => feature.name) ?? []
                }
                announcements.push(announcement)
            
        }
        } 
             
    }
   
    return announcements
    
    } catch (error) {
        errorWithTimeStamp('Bad request to digi traffic API, no traffic announcements received')
        return []
    }

}
