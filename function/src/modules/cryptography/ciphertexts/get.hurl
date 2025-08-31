# Prepare secret to run tests on
POST http://localhost:4000/v1/cryptography/ciphertexts
{
    "ttl": "hour",
    "reads": 10,
    "secret": "A secret"
}
HTTP 201
[Captures]
secret_id: jsonpath "$.['$id']"
[Asserts]
jsonpath "$['$id']" isString

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
jsonpath "$.reads" == 10

# Non-existing secret
GET http://localhost:4000/v1/cryptography/ciphertexts/some-secret
HTTP 404

# Missing secret
POST http://localhost:4000/v1/cryptography/ciphertexts/{{secret_id}}
HTTP 405