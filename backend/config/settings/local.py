"""
Local development settings for PharmaManager.

Extends base settings with development-specific overrides.
"""

from .base import *  # noqa: F401, F403

DEBUG = True

# In development, allow all origins for convenience
CORS_ALLOW_ALL_ORIGINS = True
