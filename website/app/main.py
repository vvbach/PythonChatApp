from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router

from app.core.config import settings
from app.database.db import (
    startup_db_client,
    shutdown_db_client,
    db_connection_status,
)




API_VERSION = settings.API_V_STR


app = FastAPI()


# Register the startup event handler
@app.on_event('startup')
async def startup_event():
    await startup_db_client(app)
    await db_connection_status()


# Register the shutdown event handler
@app.on_event('shutdown')
async def shutdown_event():
    await shutdown_db_client(app)




app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


# App root
@app.get('/', tags=['Root'])
async def root():
    return {'message': 'Welcome to this fantastic app !!'}


# Api Routers
app.include_router(api_router, prefix=API_VERSION)


# routes = [WebSocketRoute(path, endpoint=...), ...]
# app = Starlette(routes=routes)

 


