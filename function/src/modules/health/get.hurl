# Health endpoint responds
GET {{host}}/v1/health
HTTP 200
[Asserts]
jsonpath "$.status" == "pass"
jsonpath "$.version" isString
jsonpath "$.releaseId" isString
jsonpath "$.checks.appwrite.status" == "pass"
jsonpath "$.checks.appwrite.version" isString

POST {{host}}/v1/health
HTTP 405

PUT {{host}}/v1/health
HTTP 405

PATCH {{host}}/v1/health
HTTP 405

DELETE {{host}}/v1/health
HTTP 405