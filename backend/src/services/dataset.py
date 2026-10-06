from zipfile import BadZipFile

from repositories.excel_dataset import ExcelDatasetRepository
from schemas.dataset import DatasetSchema
from services.exceptions import DatasetUnavailableError


class DatasetService:
    def __init__(self, repository: ExcelDatasetRepository):
        self._repository = repository

    def get_dataset(self) -> DatasetSchema:
        try:
            return self._repository.get()
        except FileNotFoundError as e:
            raise DatasetUnavailableError(f"Файл не найден: {e.filename}") from e
        except (PermissionError, BadZipFile, OSError) as e:
            raise DatasetUnavailableError("Файл занят или повреждён, повторите позже") from e

    def get_version(self) -> int:
        return self._repository.version()
