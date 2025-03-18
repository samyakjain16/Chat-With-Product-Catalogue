# db/mongodb/models/schema_builder.py
from typing import Any, Dict, Optional
from pydantic import BaseModel, create_model
from datetime import datetime

class SchemaBuilder:
    def analyze_sample_and_build_model(self, sample_document: Dict[str, Any]):
        field_definitions = {}
        
        for field_name, value in sample_document.items():
            field_type = self._get_field_type(value)
            field_definitions[field_name] = (field_type, None)
            
        DynamicProductModel = create_model(
            'DynamicProduct',
            **field_definitions,
            __base__=BaseModel
        )
        
        return DynamicProductModel
    
    def _get_field_type(self, value: Any):
        if isinstance(value, str):
            return Optional[str]
        elif isinstance(value, int):
            return Optional[int]
        elif isinstance(value, float):
            return Optional[float]
        elif isinstance(value, bool):
            return Optional[bool]
        elif isinstance(value, list):
            if value:
                item_type = self._get_field_type(value[0])
                return Optional[list[item_type]]
            return Optional[list]
        elif isinstance(value, dict):
            nested_fields = {
                k: (self._get_field_type(v), None) 
                for k, v in value.items()
            }
            return Optional[create_model(f'NestedModel', **nested_fields)]
        elif isinstance(value, datetime):
            return Optional[datetime]
        else:
            return Optional[Any]