from datetime import datetime
from typing import Dict
from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.search_service import ProductSearchService
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.schema.field_mapper import FieldMapper
import os
from dotenv import load_dotenv
load_dotenv()

class DatabaseConnection(BaseModel):
    mongodb_uri: str
    db_name: str
    collection_name: str

router = APIRouter()

@router.post("/connect-db")
async def connect_database(connection: DatabaseConnection):
    try:
        # Just verify connection and basic validation
        client = AsyncIOMotorClient(connection.mongodb_uri)
        db = client[connection.db_name]
        collection = db[connection.collection_name]
        
        # Test connection by fetching one document
        sample = await collection.find_one()
        if not sample:
            raise HTTPException(status_code=400, detail="Collection is empty")

        return {
            "status": "success",
            "message": "Successfully connected to database"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# app/api/routes/product_routes.py

class FieldMappingUpdate(BaseModel):
    mongodb_uri: str
    db_name: str
    collection_name: str
    field_mappings: Dict[str, str]

@router.post("/update-mappings")
async def update_field_mappings(update: FieldMappingUpdate):
    try:
        # Here you would typically store these mappings
        # For now, just validate and return
        return {
            "status": "success",
            "message": "Field mappings updated",
            "field_mappings": update.field_mappings
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



class SearchRequest(BaseModel):
    query: str
    mongodb_uri: str
    db_name: str
    collection_name: str
    
    
@router.post("/search")
async def search_products(request: SearchRequest):
    try:
        client = AsyncIOMotorClient(request.mongodb_uri)
        db = client[request.db_name]
        collection = db[request.collection_name]
        
        # Get latest mappings
        mappings_doc = await db["field_mappings"].find_one({
            "db_name": request.db_name,
            "collection_name": request.collection_name
        })
        
        if not mappings_doc:
            raise HTTPException(status_code=400, detail="Field mappings not found. Please analyze fields first.")
            
        field_mappings = mappings_doc["mappings"]
        
        # Use latest mappings for search
        search_service = ProductSearchService(collection, field_mappings)
        results = await search_service.search(request.query)
        
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    

def convert_objectid_to_str(document):
    for key, value in document.items():
        if isinstance(value, ObjectId):
            document[key] = str(value)  # Convert ObjectId to string
    return document


@router.post("/analyze-fields")
async def analyze_fields(connection: DatabaseConnection):
    try:
        client = AsyncIOMotorClient(connection.mongodb_uri)
        db = client[connection.db_name]
        collection = db[connection.collection_name]
        mappings_collection = db["field_mappings"]

        # Get sample and analyze
        sample_doc = await collection.find_one()
        sample_doc = convert_objectid_to_str(sample_doc)

        field_mapper = FieldMapper(api_key=os.getenv("OPENAI_API_KEY"))
        
        field_mappings = await field_mapper.analyze_fields(sample_doc)
        print("Field Mappings before storing", field_mappings)
        # Store mappings
        await mappings_collection.update_one(
            {
                "db_name": connection.db_name,
                "collection_name": connection.collection_name
            },
            {"$set": {
                "mappings": field_mappings,
                "last_updated": datetime.utcnow()
            }},
            upsert=True
        )

        return {
            "status": "success",
            "field_mappings": field_mappings,
            "sample_document": sample_doc
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    
    
    
class UpdateMappingsRequest(BaseModel):
    mongodb_uri: str
    db_name: str
    collection_name: str
    field_mappings: Dict[str, str]

@router.post("/update-mappings")
async def update_mappings(request: UpdateMappingsRequest):
    try:
        client = AsyncIOMotorClient(request.mongodb_uri)
        db = client[request.db_name]
        mappings_collection = db["field_mappings"]

        # Update mappings
        result = await mappings_collection.update_one(
            {
                "db_name": request.db_name,
                "collection_name": request.collection_name
            },
            {"$set": {
                "mappings": request.field_mappings,
                "last_updated": datetime.utcnow()
            }}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Field mappings not found")

        return {
            "status": "success",
            "message": "Field mappings updated successfully",
            "field_mappings": request.field_mappings
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))