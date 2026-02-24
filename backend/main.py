from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
import json
import cv2
import numpy as np
import io

from config import MODELS, VALID_PARTS, IMAGES_DIR, CSV_PATH
from inference import verify_order
from logger import save_log

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static images
app.mount("/images", StaticFiles(directory=IMAGES_DIR), name="images")

@app.get("/config")
def get_config():
    return {
        "models": list(MODELS.keys()),
        "parts": VALID_PARTS
    }

@app.post("/verify")
async def verify(
    order_id: str = Form(...),
    parts: str = Form(...),  # JSON string
    model_name: str = Form(...),
    img_size: int = Form(640),
    conf_thres: float = Form(0.25),
    iou_thres: float = Form(0.45),
    file: UploadFile = File(...)
):
    try:
        parts_dict = json.loads(parts)
        
        # Read Image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image file")
            
        # Inference
        status, detected, missing, excess, annotated_img = verify_order(
            image, parts_dict, model_name, 
            img_size=img_size, conf=conf_thres, iou=iou_thres
        )
        
        # Log
        image_filename = save_log(order_id, parts, status, detected, annotated_img)
        
        return {
            "status": status,
            "detected": detected,
            "missing": missing,
            "excess": excess,
            "image_url": f"/images/{image_filename}"
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/logs")
def get_logs():
    import pandas as pd
    import os
    if not os.path.exists(CSV_PATH):
        return []
    df = pd.read_csv(CSV_PATH)
    return df.to_dict(orient="records")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
