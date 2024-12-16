import { TrafficAnnouncement } from "../../types/announcementTypes"
import { Driver, Session } from 'neo4j-driver'
import { errorWithTimeStamp, logWithTimestamp } from '../../utils/logWithTimeStamp'
import { queryGenerator } from "../../utils/neo4j/queryGenerator"

/**
 * Function that receives an array of Traffic announcements
 * and connects them to the corresponding RoadSegment nodes.
 * @param announcements TrafficAnnouncement[]: Objects that contain traffic announcement information.
 * @param neodriver Driver: Neo4J Driver
 * @author Arttu Myllyneva
 */
export const handleAnnouncements = async (announcements: TrafficAnnouncement[], neodriver: Driver): Promise<void> => {
    

    if (announcements.length < 1) {
    logWithTimestamp(`Neo4J Service: No traffic announcements received`)
    }else{
    logWithTimestamp(`Neo4J Service: Linking traffic announcements to RoadSegment nodes`)
    }

    const session: Session = neodriver.session()
    
    try{
        await session.run(queryGenerator.linkAnnouncements(), {announcements})

        logWithTimestamp(`Neo4J Service: Traffic announcements successfully processed`)
    } catch (error) {
        errorWithTimeStamp(`Neo4J Service: Error processing traffic announcements: ${error}`)
        session.close()
        throw error
      } finally {
        await session.close()
      }

}