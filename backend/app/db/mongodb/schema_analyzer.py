from typing import Any, Dict
from datetime import datetime

def get_field_type(value: Any) -> str:
    if isinstance(value, str):
        return "string"
    elif isinstance(value, int):
        return "integer"
    elif isinstance(value, float):
        return "number"
    elif isinstance(value, bool):
        return "boolean"
    elif isinstance(value, datetime):
        return "date"
    elif isinstance(value, list):
        if value:
            return f"array<{get_field_type(value[0])}>"
        return "array"
    elif isinstance(value, dict):
        return "object"
    else:
        return "unknown"

async def analyze_schema(client, db_name: str, collection_name: str) -> Dict:
    try:
        # Get collection
        db = client[db_name]
        collection = db[collection_name]
        
        # Get sample document
        sample = await collection.find_one()
        if not sample:
            return {"message": "No documents found in collection"}
            
        # Analyze schema
        schema = {}
        for field_name, value in sample.items():
            schema[field_name] = {
                "type": get_field_type(value),
                "sample": str(value)[:10]  # First 100 chars of sample value
            }
            
        return schema
        
    except Exception as e:
        raise Exception(f"Error analyzing schema: {str(e)}")