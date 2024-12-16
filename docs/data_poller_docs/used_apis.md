# Used APIs

**This document is originally from the `api_testing` directory.
The original document will not receive any more updates.**

Atte Oksanen 5.3.2024

Collection of APIs used in this project.
This list contains APIs only used in the final version.
For more information on unused APIs, visit the original document in the `api_testing` directory

## OpenStreetMap - Overpass <https://overpass-turbo.eu/>

[Overpass documentation](https://wiki.openstreetmap.org/wiki/Overpass_API)

Overpass is a read-only API for the OpenStreetMap database.
The data is polled with the query below.

```OQL
[out:json];
(
  way["highway"]["highway"~"^(unclassified|trunk|motorway|primary|secondary|tertiary|residential)$"]["bicycle"!="designated"](64.7,25.2486,65.1968,25.9491);
  <;
);
(._;<;);
out geom(64.7,25.2486,65.1968,25.9491) body;
```

## City of Oulu

### GraphQL API provided by the City of Oulu <https://api.oulunliikenne.fi/proxy/graphql>

#### Queried with

* GetMaintenanceVehicleRouteEvents
  * This API has worked twice in the last three months, so a mock data generator has been created to fill in the missing data.
  * A backup of this data is saved in the repo as "testData_with_maintenance.json".

Queries fetched from <https://wp.oulunliikenne.fi/avoin-data/autoliikenne/graphql-rajapinnat/>

<div style="page-break-after: always;"></div>

## FMI

[API reference for FMI WFS](https://en.ilmatieteenlaitos.fi/open-data-manual-fmi-wfs-services)

### ECMWF forecast WFS API provided by FMI <https://opendata.fmi.fi/wfs>

***NOTE: This APIs integration is not implemented in the current version of the data poller***

* service=WFS
* version=2.0.0
* request=getFeature
* storedquery_id=ecmwf::forecast::surface::point::multipointcoverage
  * Querying multi point coverage data on a coordinate point
* latlon=65.0118734,25.4716809
  * Querying to a spesific point
    * Example return
      * GeopHeight: 30.3,
      * Temperature: -3.8,
      * Pressure: 988.2,
      * Humidity: 87.1,
      * WindDirection: null,
      * WindSpeedMS: null,
      * WindUMS: -0.3,
      * WindVMS: 5,
      * MaximumWind: null,
      * WindGust: null,
      * DewPoint: null,
      * TotalCloudCover: null,
      * WeatherSymbol3: null,
      * LowCloudCover: null,
      * MediumCloudCover: null,
      * HighCloudCover: null,
      * Precipitation1h: 0,
      * PrecipitationAmount: null,
      * RadiationGlobalAccumulation: null,
      * RadiationLWAccumulation: null,
      * RadiationNetSurfaceLWAccumulation: null,
      * RadiationNetSurfaceSWAccumulation: null,
      * RadiationDiffuseAccumulation: null,
      * LandSeaMask: null
