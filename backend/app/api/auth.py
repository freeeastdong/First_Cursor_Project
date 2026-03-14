from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.core.database import get_session
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["认证"])


@router.post("/register", response_model=TokenResponse)
def register(body: RegisterRequest, session: Session = Depends(get_session)):
    if session.exec(select(User).where(User.username == body.username)).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="用户名已存在")
    if session.exec(select(User).where(User.email == body.email)).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="邮箱已被注册")

    user = User(
        username=body.username,
        email=body.email,
        hashed_password=hash_password(body.password),
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return TokenResponse(access_token=create_access_token(user.id))


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == body.username)).first()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="用户名或密码错误")
    return TokenResponse(access_token=create_access_token(user.id))


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
