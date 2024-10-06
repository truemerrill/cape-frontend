# CAPE Frontend

A simple frontend application for the October 2024 CAPE demo.

## Backend 

The frontend application needs to know the URL of the backend API.  Edit the 
`.env` file with the URL of the backend

```
# Note: any variable prefixed with VITE_ is exposed to the JS client.  Any
#   other variables wont be accessible to the client side.

# The URL to the API backend
VITE_BACKEND_URL=http://localhost:8080
```
