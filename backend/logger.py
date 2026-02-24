import os
import cv2
import pandas as pd
from datetime import datetime
from config import IMAGES_DIR, CSV_PATH

def save_log(order_id: str, formatted_order: str, result_status: str, detected_counts: dict, image):
    # Save Image
    image_filename = f"{order_id}.jpg"
    image_path = os.path.join(IMAGES_DIR, image_filename)
    cv2.imwrite(image_path, image)
    
    # Create Log Entry
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "order_id": order_id,
        "ordered_parts": formatted_order,
        "result": result_status,
        "detected_parts": str(detected_counts),
        "image_file": image_filename
    }
    
    # Update CSV
    if os.path.exists(CSV_PATH):
        df = pd.read_csv(CSV_PATH)
        df = pd.concat([df, pd.DataFrame([log_entry])], ignore_index=True)
    else:
        df = pd.DataFrame([log_entry])
        
    df.to_csv(CSV_PATH, index=False)
    
    return image_filename
