# app/core/query_processing/query_builder.py
from typing import Dict
from .clothing_analyzer import ClothingQueryAttributes

class MongoDBQueryBuilder:
    def __init__(self, field_mappings: Dict[str, str]):
        """
        field_mappings: Maps standard fields to user's MongoDB fields
        e.g., {"product_type": "category", "color": "variant_color"}
        """
        self.field_mappings = field_mappings

    def build_query(self, attributes: ClothingQueryAttributes) -> Dict:
        """Build MongoDB query from extracted attributes"""
        query = {"$and": []}

        if attributes.product_type:
            field = self.field_mappings.get("product_type", "product_type")
            query["$and"].append({
                field: {"$regex": attributes.product_type, "$options": "i"}
            })

        if attributes.color:
            field = self.field_mappings.get("color", "color")
            query["$and"].append({
                field: {"$in": attributes.color}
            })

        if attributes.price_range:
            field = self.field_mappings.get("price", "price")
            price_query = {}
            if "min" in attributes.price_range:
                price_query["$gte"] = attributes.price_range["min"]
            if "max" in attributes.price_range:
                price_query["$lte"] = attributes.price_range["max"]
            query["$and"].append({field: price_query})

        return query