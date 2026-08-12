def normalize_email(email: str) -> str:
    """Normalize and canonicalize an email address for identity matching.

    Rules:
    - Strip leading/trailing whitespace
    - Lowercase using casefold()
    - Reject empty string
    - Basic sanity validation (must contain '@')
    """
    if not email or not email.strip():
        raise ValueError("Email address cannot be empty.")

    normalized = email.strip().casefold()
    if "@" not in normalized or normalized.startswith("@") or normalized.endswith("@"):
        raise ValueError("Invalid email address format.")

    return normalized
