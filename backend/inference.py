from ultralytics import YOLO
import cv2
import numpy as np
from config import MODELS, VALID_PARTS
import os

class ModelManager:
    def __init__(self):
        self.loaded_models = {}

    def get_model(self, model_name: str):
        if model_name not in MODELS:
            raise ValueError(f"Model {model_name} not found in configuration.")
        
        if model_name not in self.loaded_models:
            print(f"Loading model: {model_name}")
            self.loaded_models[model_name] = YOLO(MODELS[model_name])
        
        return self.loaded_models[model_name]

model_manager = ModelManager()

def verify_order(image: np.ndarray, order_parts: dict, model_name: str, img_size: int = 640, conf: float = 0.25, iou: float = 0.45):
    model = model_manager.get_model(model_name)
    results = model(image, imgsz=img_size, conf=conf, iou=iou)
    
    detected_counts = {part: 0 for part in VALID_PARTS}
    detections = results[0]
    
    # Process detections
    for box in detections.boxes:
        cls_id = int(box.cls[0])
        cls_name = model.names[cls_id]
        if cls_name in detected_counts:
            detected_counts[cls_name] += 1
            
    # Draw boxes on image for logging
    annotated_image = detections.plot()
    
    # Verification Logic
    status = "Verified"
    missing = {}
    excess = {}
    
    for part, count in order_parts.items():
        if part not in VALID_PARTS:
            continue # Ignore invalid parts in order or handle error? Assuming valid.
            
        detected = detected_counts.get(part, 0)
        
        if detected < count:
            status = "Incomplete"
            missing[part] = count - detected
        elif detected > count:
            if status == "Verified": status = "Excess" # Incomplete takes precedence? Or Excess?
            # If implementation says "Order Excess", let's prioritize Incomplete if any missing, 
            # else Excess if any excess.
            if status != "Incomplete":
                status = "Excess"
            excess[part] = detected - count
            
    # Check for excess of non-ordered parts?
    # "If the order count exceed , then the application should give output Order Excess."
    # This usually implies strictly matching the *entire* detected set vs requested set?
    # Use case: "I place an order... If the ordered parts are being detected and also the counts is matching... Verified"
    # If I order 1 bracket, and see 1 bracket AND 1 iphone. Is that Excess? 
    # The prompt says "If there is an item is missing... Incomplete. If the order count exceed... Excess."
    # User clarification said "The partnames should be selected from the list of 10 parts".
    # I will stick to checking counts of *ordered* parts primarily, but also check if *unordered* valid parts are present.
    
    for part in VALID_PARTS:
        if part not in order_parts and detected_counts[part] > 0:
             if status != "Incomplete": status = "Excess"
             excess[part] = detected_counts[part]

    # "If any other cases happens , then the application should give output Order FAIL."
    # This might catch broad failures.
    
    return status, detected_counts, missing, excess, annotated_image
