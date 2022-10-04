from Entity import Frame
from fastapi.middleware.cors import CORSMiddleware
from FrameDAO import FrameDAO as dao
from fastapi.responses import Response, JSONResponse
from fastapi import FastAPI, status

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/{val}')
async def home(val):  # put application's code here
    return 'Hello World!' + val


@app.post('/save', status_code=201)
async def registra_momento(frame: Frame):
    frame = await dao.save(frame)
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=frame)
