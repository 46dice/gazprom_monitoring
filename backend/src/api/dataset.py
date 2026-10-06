import asyncio
from collections.abc import AsyncIterator

from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from api.dependencies import DatasetServiceDep
from core.config import settings
from schemas.dataset import DatasetSchema, DatasetVersionSchema

router = APIRouter(prefix="/api/dataset", tags=["Dataset"])


# Синхронная ручка: FastAPI выполнит её в пуле потоков, и разбор большого файла
# не заблокирует остальные запросы (в том числе SSE).
@router.get("", response_model=DatasetSchema)
def get_dataset(service: DatasetServiceDep):
    return service.get_dataset()


@router.get("/events")
async def dataset_events(request: Request, service: DatasetServiceDep) -> StreamingResponse:
    """SSE: шлёт новую версию, когда файл изменился. Первое событие — сразу при подключении."""

    async def stream() -> AsyncIterator[str]:
        last_version = None
        while not await request.is_disconnected():
            version = service.get_version()
            if version != last_version:
                last_version = version
                payload = DatasetVersionSchema(version=version).model_dump_json()
                yield f"event: dataset-changed\ndata: {payload}\n\n"
            await asyncio.sleep(settings.WATCH_INTERVAL_SEC)

    return StreamingResponse(stream(), media_type="text/event-stream", headers={"Cache-Control": "no-cache"})
