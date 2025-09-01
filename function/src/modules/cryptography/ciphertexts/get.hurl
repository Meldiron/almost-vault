# Prepare secret to run tests on
POST http://localhost:4000/v1/cryptography/ciphertexts
{
    "ttl": "hour",
    "reads": 3,
    "secret": "A secret"
}
HTTP 201
[Captures]
secret_id: jsonpath "$.['$id']"
[Asserts]
jsonpath "$['$id']" isString
jsonpath "$.reads" == 3

# Get an existing secret
GET http://localhost:4000/v1/cryptography/ciphertexts/{{secret_id}}
HTTP 200
[Asserts]
jsonpath "$['$id']" isString
jsonpath "$['$id']" == "{{secret_id}}"
jsonpath "$.['$sequence']" isNumber
jsonpath "$.['$permissions']" count == 0
jsonpath "$.['$databaseId']" == "main"
jsonpath "$.['$tableId']" == "secrets"
jsonpath "$.['$createdAt']" isString
jsonpath "$.['$updatedAt']" isString
jsonpath "$.secret" == "A secret"
jsonpath "$.ttl" == "hour"
jsonpath "$.reads" == 2 # Notice it's not 3 because count was lowered

# Ensure reads block it eventuelly
GET http://localhost:4000/v1/cryptography/ciphertexts/{{secret_id}}
HTTP 200
[Asserts]
jsonpath "$.reads" == 1
GET http://localhost:4000/v1/cryptography/ciphertexts/{{secret_id}}
HTTP 200
[Asserts]
jsonpath "$.reads" == 0
GET http://localhost:4000/v1/cryptography/ciphertexts/{{secret_id}}
HTTP 400

# TTL actually expires
POST http://localhost:4000/v1/cryptography/ciphertexts
{
    "ttl": "mock",
    "reads": 100,
    "secret": "Expiring soon"
}
HTTP 201
[Captures]
secret_id: jsonpath "$.['$id']"
[Asserts]
jsonpath "$['$id']" isString
jsonpath "$.ttl" == "mock"

GET http://localhost:4000/v1/cryptography/ciphertexts/{{secret_id}}
HTTP 200
[Asserts]
jsonpath "$.secret" == "Expiring soon"

GET http://localhost:4000/v1/cryptography/ciphertexts/{{secret_id}}
[Options]
delay: 6s # After 5 seconds it expires, 1 second extra just to be sure
HTTP 400

# Non-existing secret
GET http://localhost:4000/v1/cryptography/ciphertexts/some-secret
HTTP 404

# Missing secret
POST http://localhost:4000/v1/cryptography/ciphertexts/{{secret_id}}
HTTP 405