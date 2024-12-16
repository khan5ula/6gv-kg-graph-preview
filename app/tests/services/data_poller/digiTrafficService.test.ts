import { getTrafficAnnouncements } from '../../../src/services/data_poller/digitrafficService'

test("should error on a failed api response", async () => {
    
    const API_URL =
      'https://tie.digitraffic.fi/api/traffic-message/v1/messages?inactiveHours=0&includeAreaGeometry=false&situationType=TRAFFIC_ANNOUNCEMENT_malformedToErrorOnPurpose'

    
    expect(getTrafficAnnouncements(API_URL)).toThrow
    
    
  })



