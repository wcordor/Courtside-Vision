# Development Log

## 20 Dec 2025: API & Authorization Issues

### API Chain of Errors

- **404 (Not Found):** Initially called a non-existent endpoint. Fixed by auditing SDK documentation and ensuring request path matched V2 API specifications.  
- **401 (Unauthorized):** Was receiving HTML page instead of JSON. Updated code by adding condition to stop JSON from crashing. Error 429 unmasked as real error.
- **429 

## 21 Dec 2025:
