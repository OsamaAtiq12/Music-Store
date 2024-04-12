from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.routes import rest_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Music House",
    description="APIs for Music House",
    version="0.0.1",
    docs_url="/docs",
)
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(rest_router)


@app.exception_handler(Exception)
async def handle_exception(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"message": str(exc)})
