from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
from app.utils.logger import logger


async def test_connection(mongodb_uri: str, db_name: str, collection_name: str):
    try:
        logger.info(f"Attempting to connect to database: {db_name}, collection: {collection_name}")
        client = AsyncIOMotorClient(mongodb_uri)
        await client.admin.command('ping')
        
        db = client[db_name]
        collection = db[collection_name]
        await collection.find_one()
        
        logger.info("Successfully connected to database")
        return client
        
    except ConnectionFailure as e:
        logger.error(f"Connection failure: {str(e)}")
        raise Exception("Failed to connect to MongoDB. Please check your connection details.")
    except Exception as e:
        logger.error(f"Unexpected error during connection: {str(e)}")
        raise Exception("An unexpected error occurred while connecting to the database.")