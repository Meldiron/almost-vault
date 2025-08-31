# Base path is empty
GET http://localhost:4000/
HTTP 404

# Non-existing path is empty
GET http://localhost:4000/some-path
HTTP 404

# Non-get methods work well too
POST http://localhost:4000/some-path
HTTP 404

PUT http://localhost:4000/some-path
HTTP 404

PATCH http://localhost:4000/some-path
HTTP 404

DELETE http://localhost:4000/some-path
HTTP 404
