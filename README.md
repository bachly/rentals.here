# Bike Rentals

## Data models

bikes:

- model
- color
- location
- availability

users:

- username
- password
- roles

reservations:

- reservationId
- bikeId
- userId
- fromDate
- toDate

bike_ratings:

- ratingId
- bikeId
- userId
- rating

## Functionalities

Any user:

- See list of bikes available in specific date
- Filter bikes by model, color, location or rate averages
- CRUD reservations
- Rate a bike

User with Manager role:

- CRUD bikes
- CRUD users
- See all the users who reserved a bike, and the period of time they did it.
- See all the bikes reserved by a user and the period of time they did it.

## View Routes

- / (React app)
- /register
- /login
- /logout

## API Routes

- CRUD /v1/bikes
- CRUD /v1/users
- CRUD /v1/reservations
