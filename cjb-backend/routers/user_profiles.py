from typing import Optional, List # Added List
import datetime

from fastapi import APIRouter, Depends, HTTPException, status, Response, Request # Add Response and Request
from pydantic import BaseModel, EmailStr, HttpUrl
from sqlalchemy.orm import Session

from db.database import get_db
from db import models as db_models
from auth.utils import get_current_user, require_role # Updated to include require_role

router = APIRouter(
    prefix="/user-profiles",
    tags=["user-profiles"],
    responses={404: {"description": "Not found"}},
)

# --- Pydantic Models for User Profiles ---

class UserProfileBase(BaseModel):
    email: EmailStr # Will be populated from auth token primarily
    full_name: Optional[str] = None
    profile_picture_url: Optional[HttpUrl] = None
    bio: Optional[str] = None
    role: str = "user" # Added role with default

class UserProfileCreate(UserProfileBase):
    # For explicit creation, user_id will come from the token
    pass

class UserProfileUpdate(BaseModel): # Separate model for update to allow partial updates
    full_name: Optional[str] = None
    profile_picture_url: Optional[HttpUrl] = None
    bio: Optional[str] = None
    # Role is NOT updatable by the user themselves here

class UserProfileAdminUpdate(UserProfileUpdate): # Inherits from UserProfileUpdate
    role: Optional[str] = None # Admins can optionally update the role
    email: Optional[EmailStr] = None # Admins might need to correct an email
    # user_id (the Auth0 sub) should generally not be changed.

class UserProfile(UserProfileBase):
    id: int
    user_id: str # The unique ID from the authentication provider (e.g., Auth0 sub)
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True


@router.post(
    "/",
    response_model=UserProfile,
    summary="Get current user's profile or create if not exists",
    status_code=status.HTTP_200_OK # Default, will be overridden if created
)
async def get_or_create_current_user_profile(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("sub") # 'sub' is typically the user ID in Auth0 JWT tokens
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials or user ID missing from token.",
        )

    email = current_user.get("email")
    if not email:
        # Try to fetch userinfo from Auth0
        from auth.utils import get_userinfo_from_auth0
        import os
        auth_header = request.headers.get('authorization')
        if auth_header and auth_header.startswith('Bearer '):
            access_token = auth_header.replace('Bearer ', '')
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email missing from token and access token not available to fetch userinfo from Auth0.",
            )
        auth0_domain = os.environ.get("AUTH0_DOMAIN")
        if not auth0_domain:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="AUTH0_DOMAIN not set in environment variables.",
            )
        userinfo = get_userinfo_from_auth0(access_token, auth0_domain)
        email = userinfo.get("email")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email not found in Auth0 userinfo response.",
            )

    # Check if a profile already exists for this user_id
    db_profile = db.query(db_models.UserProfile).filter(db_models.UserProfile.user_id == user_id).first()

    if db_profile:
        response.status_code = status.HTTP_200_OK # Profile found
        return db_profile

    # Profile does not exist, create a new one
    # Initially, we'll just use user_id and email from the token.
    # Other details (full_name, bio, etc.) can be updated via a separate PATCH/PUT endpoint.
    new_profile_data = db_models.UserProfile(user_id=user_id, email=email)
    
    db.add(new_profile_data)
    db.commit()
    db.refresh(new_profile_data)
    
    response.status_code = status.HTTP_201_CREATED # Profile created
    return new_profile_data


# --- New CRUD Endpoints ---

@router.get(
    "/me", 
    response_model=UserProfile, 
    summary="Get current authenticated user's profile"
)
async def get_current_user_profile_me(
    current_user_db_profile: db_models.UserProfile = Depends(require_role(["user", "admin"])) # require_role returns the user's database profile object on success
):
    return current_user_db_profile

@router.patch(
    "/me", 
    response_model=UserProfile, 
    summary="Update current authenticated user's profile"
)
async def update_current_user_profile_me(
    profile_update_data: UserProfileUpdate, # Pydantic model for allowed updates
    db: Session = Depends(get_db),
    current_user_db_profile: db_models.UserProfile = Depends(require_role(["user", "admin"])) # current_user_db_profile is the existing profile from the DB, fetched by require_role
):
    update_data = profile_update_data.model_dump(exclude_unset=True) # Get only fields that were actually provided

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No update data provided."
        )

    for key, value in update_data.items():
        setattr(current_user_db_profile, key, value)
    
    current_user_db_profile.updated_at = datetime.datetime.utcnow() # Manually update timestamp
    
    db.add(current_user_db_profile) # Add to session (SQLAlchemy tracks changes)
    db.commit()
    db.refresh(current_user_db_profile)
    
    return current_user_db_profile

# --- Admin Only User Profile Endpoints ---

@router.get(
    "/",
    response_model=List[UserProfile],
    summary="List all user profiles (Admin only)"
)
async def list_all_user_profiles(
    db: Session = Depends(get_db),
    admin_profile: db_models.UserProfile = Depends(require_role(["admin"]))
):
    profiles = db.query(db_models.UserProfile).all()
    return profiles

@router.get(
    "/{user_id_param:str}",
    response_model=UserProfile,
    summary="Get a specific user's profile by their user_id (Admin only)"
)
async def get_user_profile_by_user_id(
    user_id_param: str,
    db: Session = Depends(get_db),
    admin_profile: db_models.UserProfile = Depends(require_role(["admin"]))
):
    target_profile = db.query(db_models.UserProfile).filter(db_models.UserProfile.user_id == user_id_param).first()
    if not target_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User profile with user_id '{user_id_param}' not found."
        )
    return target_profile

@router.put(
    "/{user_id_param:str}",
    response_model=UserProfile,
    summary="Update a specific user's profile, including role (Admin only)"
)
async def update_user_profile_by_admin(
    user_id_param: str,
    profile_update_data: UserProfileAdminUpdate, # Use the admin update model
    db: Session = Depends(get_db),
    admin_profile: db_models.UserProfile = Depends(require_role(["admin"]))
):
    target_profile = db.query(db_models.UserProfile).filter(db_models.UserProfile.user_id == user_id_param).first()
    if not target_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User profile with user_id '{user_id_param}' not found to update."
        )

    update_data = profile_update_data.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No update data provided."
        )

    if "role" in update_data and update_data["role"] not in ["user", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role specified. Must be 'user' or 'admin'."
        )

    for key, value in update_data.items():
        setattr(target_profile, key, value)

    target_profile.updated_at = datetime.datetime.utcnow()

    db.add(target_profile)
    db.commit()
    db.refresh(target_profile)

    return target_profile

@router.delete(
    "/{user_id_param:str}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a specific user's profile (Admin only)"
)
async def delete_user_profile_by_admin(
    user_id_param: str,
    db: Session = Depends(get_db),
    admin_profile: db_models.UserProfile = Depends(require_role(["admin"]))
):
    target_profile = db.query(db_models.UserProfile).filter(db_models.UserProfile.user_id == user_id_param).first()
    if not target_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User profile with user_id '{user_id_param}' not found to delete."
        )

    db.delete(target_profile)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


