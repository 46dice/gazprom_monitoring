from typing import Annotated

from fastapi import Depends

from core.config import settings
from repositories.excel_dataset import ExcelDatasetRepository
from services.dataset import DatasetService

# Один репозиторий на приложение — в нём кэш прочитанного файла.
_repository = ExcelDatasetRepository(settings.EXCEL_PATH, settings.HEADER_ROWS)


def get_dataset_service() -> DatasetService:
    return DatasetService(_repository)


DatasetServiceDep = Annotated[DatasetService, Depends(get_dataset_service)]
