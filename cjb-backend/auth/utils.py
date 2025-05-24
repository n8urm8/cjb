import os
import requests
from jose import jwt, jwk
from jose.exceptions import JOSEError, JWTError
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
API_AUDIENCE = os.getenv("AUTH0_API_AUDIENCE")
ALGORITHMS = ["RS256"]

if not AUTH0_DOMAIN or not API_AUDIENCE:
    raise RuntimeError("AUTH0_DOMAIN or AUTH0_API_AUDIENCE not set in environment variables.")

# To cache JWKS
_jwks = None

security = HTTPBearer()

def get_jwks():
    """Fetches the JSON Web Key Set (JWKS) from Auth0."""
    global _jwks
    if _jwks is None:
        try:
            response = requests.get(f"https://{AUTH0_DOMAIN}/.well-known/jwks.json", timeout=10)
            response.raise_for_status() # Raise an exception for HTTP errors
            _jwks = response.json()
        except requests.exceptions.RequestException as e:
            raise HTTPException(status_code=500, detail=f"Could not fetch JWKS: {e}")
    return _jwks

def verify_token(token: str):
    """Verifies a JWT token from Auth0."""
    if not token:
        raise HTTPException(status_code=401, detail="Authorization token required")

    jwks = get_jwks()
    print(f"--- JWKS from Auth0 ({AUTH0_DOMAIN}) ---")
    print(jwks)
    print("--------------------------------------")
    try:
        unverified_header = jwt.get_unverified_header(token)
        print(f"--- Token Header KID: {unverified_header.get('kid')} ---")
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token header: {e}")

    rsa_key = {}
    print("--- Available KIDs in JWKS ---")
    for key_in_jwks in jwks.get("keys", []):
        print(f"  - {key_in_jwks.get('kid')}")
    print("-----------------------------")

    for key in jwks.get("keys", []): # Use .get for safety
        if key.get("kid") == unverified_header.get("kid"): # Use .get for safety
            print(f"--- Matched KID: {key.get('kid')} ---")
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"]
            }
            break
    
    if not rsa_key:
        raise HTTPException(status_code=401, detail="Unable to find appropriate key")

    try:
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=ALGORITHMS,
            audience=API_AUDIENCE,
            issuer=f"https://{AUTH0_DOMAIN}/"
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token is expired")
    except jwt.JWTClaimsError as e:
        raise HTTPException(status_code=401, detail=f"Invalid claims: {e}")
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")
    except Exception as e: # Catch any other JOSE errors or unexpected errors
        raise HTTPException(status_code=401, detail=f"Unable to parse authentication token: {e}")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """FastAPI dependency to get the current user from the token."""
    token = credentials.credentials
    payload = verify_token(token)
    # You can add more checks here, e.g., check for specific scopes in payload.get("scope")
    return payload
