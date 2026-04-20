# Part Presence Verification System

An industrial order verification system that ensures the correct parts and quantities are present in a given scene (or order batch) using computer vision.

This project consists of a **FastAPI backend** running YOLOv8 object detection models and a **React + Vite frontend** that provides an intuitive interface for order creation, model selection, camera capture, and result analysis.

##  Features

- **Object Detection & Verification:** Uses YOLOv8 models to detect parts in real-time or from uploaded images.
- **Order Matching:** Compares detected parts against user-defined order quantities to determine if the order is `Verified`, `Incomplete`, or has `Excess` items.
- **Live Camera Integration:** Capture images directly from your webcam or connected camera devices.
- **Image Upload:** Upload local images for verification.
- **Configurable Inference:** Adjust model settings like Image Size, Confidence Threshold, and IoU Threshold dynamically.
- **History Log:** Keeps track of previous verification runs, their statuses, and saves annotated images.
- **Easy Setup:** Provided `.bat` scripts make installation and running on Windows seamless.

##  Project Structure

```text
├── backend/
│   ├── config.py          # Configuration for model paths and valid parts
│   ├── inference.py       # YOLOv8 inference and verification logic
│   ├── logger.py          # CSV and image logging system
│   ├── main.py            # FastAPI application endpoints
│   ├── models.py          # Pydantic models for request/response validation
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── src/               # React components (OrderForm, DetectionView, etc.)
│   ├── package.json       # Node.js dependencies
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── vite.config.js     # Vite configuration
├── install.bat            # Script to install all dependencies
└── run.bat                # Script to start both backend and frontend servers
```
##  Prerequisites

Before you begin, ensure you have met the following requirements:

    Python 3.8+ installed.

    Node.js & npm installed.

    (Optional but recommended) A dedicated Python virtual environment.

##  Installation
Windows (Using Batch Scripts)

The easiest way to install the dependencies on Windows is to use the provided install.bat file:

    Double-click install.bat or run it from the command prompt.

    The script will automatically install backend Python requirements and frontend npm packages.

Manual Installation

Backend:
Bash

cd backend
pip install -r requirements.txt

Frontend:
Bash

cd frontend
npm install

##  Running the Application
Windows (Using Batch Scripts)

    Double-click run.bat or run it from the command prompt.

    Two command prompt windows will open, starting the FastAPI backend and the React frontend.

    Once started, open your browser and navigate to the URL shown in the console (default: http://localhost:5175).

Manual Start

Start the Backend:
Bash

cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

Start the Frontend:
Bash

cd frontend
npm run dev

##  Configuration

To use your own trained YOLOv8 models, update the MODELS dictionary in backend/config.py with the names and absolute paths to your .pt model weights. You can also modify the VALID_PARTS list to match the classes your model was trained on.
##  Usage

    Select Model: Choose the desired YOLOv8 model from the dropdown.

    Advanced Settings: Adjust the image size, confidence threshold, and IoU threshold if necessary.

    Create Order: Specify the quantities for the parts that should be present.

    Detect Scene: Upload an image or use the camera to capture a picture of the parts.

    Review Results: The application will process the image and indicate if the order is Verified, Incomplete, or contains Excess parts, along with a visual bounding box overlay.
