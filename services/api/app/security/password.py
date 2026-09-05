from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a plaintext password using Argon2id."""
    if not password:
        raise ValueError("Password cannot be empty.")
    hashed: str = str(pwd_context.hash(password))
    return hashed


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against a stored hashed password."""
    if not plain_password or not hashed_password:
        return False
    is_valid: bool = bool(pwd_context.verify(plain_password, hashed_password))
    return is_valid


def validate_password_strength(password: str) -> None:
    """Validate password strength rules (min 8 chars, must contain letter & digit)."""
    if not password or len(password) < 8:
        raise ValueError("Password must be at least 8 characters long.")
    if not any(c.isalpha() for c in password):
        raise ValueError("Password must contain at least one letter.")
    if not any(c.isdigit() for c in password):
        raise ValueError("Password must contain at least one number.")
