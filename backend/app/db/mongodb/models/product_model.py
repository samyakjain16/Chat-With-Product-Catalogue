# db/mongodb/models/product_model.py
from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from datetime import datetime

class ColorVariant(BaseModel):
    name: str
    code: str  # hex color code
    images: List[str]

class StockInfo(BaseModel):
    size: str
    color: str
    quantity: int

class ClothingProduct(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    name: str
    description: str
    category: str
    brand: str
    price: float
    original_price: Optional[float]
    currency: str = "USD"
    sizes: List[str]
    colors: List[ColorVariant]
    materials: List[str]
    gender: str
    stock: List[StockInfo]
    metadata: Dict = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
