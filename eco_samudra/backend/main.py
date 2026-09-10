from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.analytics_service import router as analytics_router
from services.sustainability_service import router as sustainability_router
from services.prediction_service import router as prediction_router

app = FastAPI(
    title="ECO-SAMUDRA API",
    description="Green Fleet Intelligence & Maritime Sustainability Analytics Engine",
    version="1.0.0"
)

# Enable CORS for local Vite development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows local frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Service Routers
app.include_router(analytics_router)
app.include_router(sustainability_router)
app.include_router(prediction_router)

@app.get("/")
def read_root():
    return {
        "app": "ECO-SAMUDRA",
        "description": "Green Fleet Intelligence & Maritime Sustainability Analytics API",
        "version": "1.0.0",
        "documentation": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "ECO-SAMUDRA Backend API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
