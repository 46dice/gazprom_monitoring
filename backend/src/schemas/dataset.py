from typing import Literal

from pydantic import BaseModel

CellValue = str | int | float | None
DataType = Literal["number", "string", "date"]


class ColumnSchema(BaseModel):
    # Ключ — из названий шапки, а не буква столбца: вставка столбца в Excel
    # не должна сбивать сохранённые на фронте графики.
    key: str
    header_group: str
    header_sub: str | None
    data_type: DataType


class DatasetSchema(BaseModel):
    version: int
    file_name: str
    columns: list[ColumnSchema]
    # Строка — массив в порядке columns: так ответ в разы меньше, чем 30 тыс. словарей.
    rows: list[list[CellValue]]


class DatasetVersionSchema(BaseModel):
    version: int
