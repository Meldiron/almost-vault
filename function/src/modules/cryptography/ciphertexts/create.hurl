# Store new secret
POST {{host}}/v1/cryptography/ciphertexts
{
    "ttl": "year",
    "reads": 5,
    "secret": "My awesome secret"
}
HTTP 201
[Asserts]
jsonpath "$.['$id']" isString
jsonpath "$.['$sequence']" isNumber
jsonpath "$.['$permissions']" count == 0
jsonpath "$.['$databaseId']" == "main"
jsonpath "$.['$tableId']" == "secrets"
jsonpath "$.['$createdAt']" isString
jsonpath "$.['$updatedAt']" isString
jsonpath "$.secret" == "My awesome secret"
jsonpath "$.ttl" == "year"
jsonpath "$.reads" == 5

# All ttl enums work well
POST {{host}}/v1/cryptography/ciphertexts
{
    "ttl": "hour",
    "reads": 5,
    "secret": "My awesome secret"
}
HTTP 201
POST {{host}}/v1/cryptography/ciphertexts
{
    "ttl": "day",
    "reads": 5,
    "secret": "My awesome secret"
}
HTTP 201
POST {{host}}/v1/cryptography/ciphertexts
{
    "ttl": "week",
    "reads": 5,
    "secret": "My awesome secret"
}
HTTP 201
POST {{host}}/v1/cryptography/ciphertexts
{
    "ttl": "month",
    "reads": 5,
    "secret": "My awesome secret"
}
HTTP 201
POST {{host}}/v1/cryptography/ciphertexts
{
    "ttl": "year",
    "reads": 5,
    "secret": "My awesome secret"
}
HTTP 201

# Unknown ttl does not work
POST {{host}}/v1/cryptography/ciphertexts
{
    "ttl": "something",
    "reads": 5,
    "secret": "My awesome secret"
}
HTTP 400

# Valid reads work well
POST {{host}}/v1/cryptography/ciphertexts
{
    "ttl": "year",
    "reads": 1,
    "secret": "My awesome secret"
}
HTTP 201
POST {{host}}/v1/cryptography/ciphertexts
{
    "ttl": "year",
    "reads": 1000,
    "secret": "My awesome secret"
}
HTTP 201

# Out-of-boundary reads does not work
POST {{host}}/v1/cryptography/ciphertexts
{
    "ttl": "week",
    "reads": 0,
    "secret": "My awesome secret"
}
HTTP 400
POST {{host}}/v1/cryptography/ciphertexts
{
    "ttl": "week",
    "reads": -1,
    "secret": "My awesome secret"
}
HTTP 400
POST {{host}}/v1/cryptography/ciphertexts
{
    "ttl": "week",
    "reads": 1001,
    "secret": "My awesome secret"
}
HTTP 400

# Missing properties does not work
POST {{host}}/v1/cryptography/ciphertexts
{
    "reads": 5,
    "secret": "My awesome secret"
}
HTTP 400
POST {{host}}/v1/cryptography/ciphertexts
{
    "ttl": "week",
    "secret": "My awesome secret"
}
HTTP 400
POST {{host}}/v1/cryptography/ciphertexts
{
    "ttl": "week",
    "reads": 5
}
HTTP 400
POST {{host}}/v1/cryptography/ciphertexts
{
    "ttl": "something",
    "reads": 5,
    "secret": ""
}
HTTP 400