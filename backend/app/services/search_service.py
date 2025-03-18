# app/services/search_service.py
from typing import List, Dict
from app.core.query_processing.clothing_analyzer import ClothingQueryAnalyzer
from app.core.query_processing.query_builder import MongoDBQueryBuilder

class ProductSearchService:
    def __init__(self, collection, field_mappings: Dict[str, str]):
        self.collection = collection
        self.analyzer = ClothingQueryAnalyzer()
        self.query_builder = MongoDBQueryBuilder(field_mappings)

    async def search(self, query: str) -> List[Dict]:
        # Analyze the query
        attributes = await self.analyzer.analyze_query(query)
        
        # Build MongoDB query
        mongo_query = self.query_builder.build_query(attributes)
        
        # Execute search
        results = await self.collection.find(mongo_query).limit(10).to_list(10)
        
        return {
            "query_understanding": attributes.dict(),
            "results": results
        }