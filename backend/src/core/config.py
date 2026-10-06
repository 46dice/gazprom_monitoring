from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=BACKEND_DIR / ".env", extra="ignore")

    EXCEL_PATH: Path = BACKEND_DIR / "data" / "База данных_СДОиС.xlsx"
    # Шапка в Excel двухуровневая (группа / подстолбец), третья строка — нумерация столбцов.
    HEADER_ROWS: int = 3

    # Как часто SSE-соединение проверяет, не изменился ли файл.
    WATCH_INTERVAL_SEC: float = 1.0

    CORS_ORIGINS: list[str] = ["http://localhost:5173"]


settings = Settings()
