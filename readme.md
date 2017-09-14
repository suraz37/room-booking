<p align="center">
https://travis-ci.org/suraz37/room-booking.svg?branch=master
</p>

## About Room Booking

- Hotel has two room types:  
- Double room ­ This has an inventory of 5 rooms 
- Single room ­ This has an inventory of 5 rooms 
- All rooms are available for booking on all days. 
- Prices and inventory are independent of each other on a daily basis. 

## Structure

- Single­page app that allows updates to the​  calendar​ , persisting to the database 
- The changes to price or inventory stay changed even if you refresh the page. 
- The Bulk Operations form allow to update multiple days at once depending on the selected criteria. 

## Tools

- Laravel 5.5 React Preset
- Backend as Laravel 5.5 framework .
- Frontend as ReactJS.
- Database MySql 7.5

## Setup Process

- composer install
- .env.example .env  // update database configuration as in docker-compose.yaml file
- sudo chmod -R 777 storage && chmod -R 777 bootstrap/cache

- docker-composer up -d --build
- docker ps -a
- docker exec -it [...app_1] bash
- php artisan migrate
- php artisan db:seed

Note: This setup will update in docker

## Build

- .travis.yml for all build script
