# app/core/schema/field_mapper.py
from openai import AsyncOpenAI
from typing import Dict

class FieldMapper:
    def __init__(self, api_key: str):
        self.client = AsyncOpenAI(api_key=api_key)

    async def analyze_fields(self, sample_document: Dict) -> Dict:
        """Analyze document fields using OpenAI"""
        
        prompt = f"""
        Analyze this MongoDB document and map its fields to standard clothing product fields.
        Document fields: {list(sample_document.keys())}
        Sample values: {sample_document}

        Return a JSON mapping for these standard fields:
        - name (field containing product name)
        - description (field containing product description)
        - price (field containing price)
        - color (field containing color information)
        - size (field containing size information)
        - category (field containing product category/type)
        - brand (field containing brand information)
        - images (field containing product images)
        
        Only include fields that are actually present in the document.
        Return response in this format:
        {{
            "name": "actual_field_name",
            "price": "actual_field_name",
            ...
        }}
        """

        response = await self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a data schema analyzer. Return only the JSON mapping without any explanation."},
                {"role": "user", "content": prompt}
            ],
            #response_format={ "type": "json_object" }
        )

        return response.choices[0].message.content