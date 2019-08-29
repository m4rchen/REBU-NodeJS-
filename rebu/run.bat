@echo off
START "distributor" node distributor.js
START "members" node microservice_members.js
START "orders" node microservice_orders.js
START "deliverers" node microservice_deliverers.js
START "reviews" node microservice_reviews.js
START "gate" node gate.js