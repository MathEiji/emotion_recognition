from datetime import datetime
from typing import Any

import pydantic
from pydantic import BaseModel, Field


class Frame(BaseModel):
    videoId: str
    videoTime: float
    imgBase64: str
    capturedAt: datetime
