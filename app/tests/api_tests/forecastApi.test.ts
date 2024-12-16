import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'

const xmlParser = new XMLParser()

test('should get data from forecast API', async () => {
  console.log('Fetching data from FMI API')
  const API_URL =
    'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=ecmwf::forecast::surface::point::multipointcoverage&latlon=64.964689,25.569477'
  const forecastData = (await axios.get(API_URL)).data
  const forecastDataJson = xmlParser.parse(forecastData)
  console.log(forecastDataJson)
  expect(forecastDataJson.data).not.toBeNull()
})
