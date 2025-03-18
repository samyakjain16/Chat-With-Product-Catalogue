# db/mongodb/repositories/product_repository.py
from typing import List, Optional
from bson import ObjectId

class ProductRepository:
    def __init__(self, collection, ProductModel):
        self.collection = collection
        self.ProductModel = ProductModel

    async def get_product(self, product_id: str):
        product_data = await self.collection.find_one({"_id": ObjectId(product_id)})
        if product_data:
            return self.ProductModel(**product_data)
        return None

    async def search_products(
        self,
        query: dict,
        skip: int = 0,
        limit: int = 20
    ):
        cursor = self.collection.find(query).skip(skip).limit(limit)
        products = await cursor.to_list(length=limit)
        return [self.ProductModel(**product) for product in products]