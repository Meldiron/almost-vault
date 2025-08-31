# Health endpoint responds
GET http://localhost:4000/v1/health
HTTP 200
[Asserts]
jsonpath "$.status" == "pass"
jsonpath "$.version" isString
jsonpath "$.releaseId" isString
jsonpath "$.checks.appwrite.status" == "pass"
jsonpath "$.checks.appwrite.version" isString

POST http://localhost:4000/v1/health
HTTP 405

PUT http://localhost:4000/v1/health
HTTP 405

PATCH http://localhost:4000/v1/health
HTTP 405

DELETE http://localhost:4000/v1/health
HTTP 405