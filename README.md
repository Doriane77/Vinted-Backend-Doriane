# Vinted-Backend-Doriane

## Authentication

| Headers      | Description |
| :----------- | ----------: |
| Bearer token |  User token |

## Route Offers

/Offers (GET) : Retrieve all user offers
| Body | type | Description |Required|
| :------- | :----: | --------------------------: |:------:|
| title | String |Title offer search| No |
| priceMin | Number |Min price search| No |
| priceMax | Number |Max price search| No |
| sort | String | price-desc /or/ price-asc | No |
| page | Number |Number of page| No |
| limit | Number |Number of offers| No |

/Offers/:id (GET) : Retrieve an offer by its id
| Param | Description | Required |
| :------- | --------------------------: |:------:|
| paramsid | offer id |Yes |

/Offer/Update (POST) : Update offer + Authentication
| Body | type | Description |Required|
| :------- | :----: | --------------------------: |:------:|
| name | String |Title offer search| No |
| description | Number |Min price search| No |
| price | Number |Max price search| No |
| brand | String | price-desc /or/ price-asc | No |
| size | Number |Number of page| No |
| color | Number |Number of offers| No |
| city | Number |Number of page| No |
| condition | Number |Number of offers| No |
| offerId | Number |Number of page| No |
| userId | Number |Number of offers| No |

## Route User

/Users (GET) : All Users
| Body | type | Description |Required|
| :------- | :----: | --------------------------: |:------:|
| title | String |Title offer search| No |
| priceMin | Number |Min price search| No |
| priceMax | Number |Max price search| No |

/User/login (POST) : User login
| Body | type | Description |Required|
| :------- | :----: | --------------------------: |:------:|
| email | String | user email| Yes |
| password | String | password of account| Yes |

/User/signUp (POST) : User login
| Body | type | Description |Required|
| :------- | :----: | --------------------------: |:------:|
| email | String | user email | Yes |
| username | String | username | Yes |
| phone | Number | user phone | Yes |
| avatar | files | user picture | Yes |
| password | String | password of account | Yes |
