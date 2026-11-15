import os
import sys

# Ensure the project root and backend packages can be found in sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(CURRENT_DIR)

if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

# Import the FastAPI application
from backend.main import app

# Export for Vercel Python Serverless Runtime
# Vercel's @vercel/python automatically uses the ASGI 'app' object
