from fastapi import APIRouter, HTTPException
import httpx
from fastapi.responses import Response

router = APIRouter(prefix="/tianditu/tiles", tags=["Tianditu"])

TIANDITU_TOKEN = "ac3385d7bfe8301140eb2c35b0e415ee"

@router.get("/{layer_type}/{z}/{x}/{y}")
async def get_tile(layer_type: str, z: int, x: int, y: int):
    subdomain = (x + y) % 8  # Distribuye entre t0 - t7
    tile_url = f"https://t{subdomain}.tianditu.gov.cn/DataServer?T={layer_type}&x={x}&y={y}&l={z}&tk={TIANDITU_TOKEN}"

    async with httpx.AsyncClient() as client:
        response = await client.get(tile_url)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Error fetching from Tianditu")

    return Response(content=response.content, media_type="image/jpeg")



