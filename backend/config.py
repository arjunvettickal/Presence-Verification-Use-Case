import os

# Model Paths
MODELS = {
    "yolov8m_replicator_720": r"C:\Users\vetti\Desktop\DocX\Academics\Thesis\Workflow\Use case\Robotics_best_Models\yolov8m_replicator_720\best.pt",
    "yolov8m_replicator_1024": r"C:\Users\vetti\Desktop\DocX\Academics\Thesis\Workflow\Use case\Robotics_best_Models\yolov8m_replicator_1024\best.pt",
    "yolov8m_synthrender_720": r"C:\Users\vetti\Desktop\DocX\Academics\Thesis\Workflow\Use case\Robotics_best_Models\yolov8m_synthrender_720\best.pt",
    "yolov8m_synthrender_1024": r"C:\Users\vetti\Desktop\DocX\Academics\Thesis\Workflow\Use case\Robotics_best_Models\yolov8m_synthrender_1024\best.pt"
}

# Valid Parts for Ordering
VALID_PARTS = [
    "u_bracket", 
    "seat", 
    "handle", 
    "bonnet", 
    "body", 
    "ballstem", 
    "l_bracket", 
    "angle_bracket", 
    "pipe_clamp", 
    "cable_shoe"
]

# Paths for Logs
LOGS_DIR = os.path.join(os.path.dirname(__file__), "data")
IMAGES_DIR = os.path.join(LOGS_DIR, "images")
CSV_PATH = os.path.join(LOGS_DIR, "logs.csv")

os.makedirs(IMAGES_DIR, exist_ok=True)
