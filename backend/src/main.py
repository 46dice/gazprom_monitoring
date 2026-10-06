import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse

from api.routers import all_routers
from core.config import settings
from services.exceptions import DatasetUnavailableError

app = FastAPI(title="СДОиС: графики по Excel")


@app.exception_handler(DatasetUnavailableError)
async def dataset_unavailable(_: Request, exc: DatasetUnavailableError):
    return JSONResponse(status_code=503, content={"detail": str(exc)})

# Весь файл в JSON — ~11 МБ, сжатый — в разы меньше.
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_methods=["GET"],
    allow_headers=["*"],
)

for router in all_routers:
    app.include_router(router)


if __name__ == "__main__":
    uvicorn.run(app="main:app", reload=True)
