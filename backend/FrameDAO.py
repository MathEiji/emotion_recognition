import motor.motor_asyncio
from fastapi.encoders import jsonable_encoder

from Entity import Frame

client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:57119")
db = client.test
frameCollection = db.get_collection("frameDTO")


def frameHelper(frame) -> dict:
    return {
        "id": str(frame["_id"]),
        "videoId": frame["videoId"],
        "videoTime": frame["videoTime"],
        "imgBase64": frame["imgBase64"],
    }


class FrameDAO:

    async def save(self: Frame) -> dict:
        frameCreated = await frameCollection.insert_one(jsonable_encoder(self))
        response = await frameCollection.find_one({"_id": frameCreated.inserted_id})
        return frameHelper(response)
