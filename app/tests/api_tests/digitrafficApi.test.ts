import axios from 'axios'

test('should get data from Digitraffic API', async () => {
    console.log('Fetching data from Digitraffic API')
    const API_URL =
      'https://tie.digitraffic.fi/api/traffic-message/v1/messages?inactiveHours=0&includeAreaGeometry=false&situationType=TRAFFIC_ANNOUNCEMENT'
    const announcementResponse = (await axios.get(API_URL))
    const announcementData = announcementResponse.data
    const announcementStatus = announcementResponse.status
    console.log(announcementStatus)
    console.log(announcementData)
    expect(announcementData).not.toBeNull()
    expect(announcementStatus).toBe(200)
  })
  