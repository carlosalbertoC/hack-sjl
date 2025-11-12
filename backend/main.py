from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import sqlite3
import os

app = FastAPI(title="Hack SJL API", version="1.0.0")

# CORS para permitir conexiones desde los frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class ReportCreate(BaseModel):
    lat: float
    lng: float
    category: str
    comment: Optional[str] = ""
    images: Optional[List[str]] = []

class Report(BaseModel):
    id: str
    lat: float
    lng: float
    category: str
    comment: str
    images: List[str]
    created_at: str
    expires_at: str
    status: str
    municipality_note: Optional[str] = None

# Base de datos SQLite simple
DB_PATH = "reports.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS reports (
            id TEXT PRIMARY KEY,
            lat REAL,
            lng REAL,
            category TEXT,
            comment TEXT,
            images TEXT,
            created_at TEXT,
            expires_at TEXT,
            status TEXT,
            municipality_note TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.get("/")
def read_root():
    return {"message": "Hack SJL API", "version": "1.0.0"}

@app.post("/api/reports", response_model=Report)
def create_report(report: ReportCreate):
    import uuid
    import json
    
    report_id = f"r_{uuid.uuid4().hex[:8]}"
    now = datetime.utcnow()
    expires = now + timedelta(hours=48)
    
    new_report = {
        "id": report_id,
        "lat": report.lat,
        "lng": report.lng,
        "category": report.category,
        "comment": report.comment or "",
        "images": json.dumps(report.images or []),
        "created_at": now.isoformat(),
        "expires_at": expires.isoformat(),
        "status": "pendiente",
        "municipality_note": None
    }
    
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        INSERT INTO reports (id, lat, lng, category, comment, images, created_at, expires_at, status, municipality_note)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        new_report["id"],
        new_report["lat"],
        new_report["lng"],
        new_report["category"],
        new_report["comment"],
        new_report["images"],
        new_report["created_at"],
        new_report["expires_at"],
        new_report["status"],
        new_report["municipality_note"]
    ))
    conn.commit()
    conn.close()
    
    new_report["images"] = report.images or []
    return Report(**new_report)

@app.get("/api/reports", response_model=List[Report])
def get_reports(
    since: Optional[str] = None,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    radius_m: Optional[float] = None
):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    query = "SELECT * FROM reports WHERE expires_at > datetime('now')"
    params = []
    
    if since:
        query += " AND created_at >= ?"
        params.append(since)
    
    query += " ORDER BY created_at DESC"
    
    c.execute(query, params)
    rows = c.fetchall()
    conn.close()
    
    reports = []
    for row in rows:
        import json
        report = {
            "id": row[0],
            "lat": row[1],
            "lng": row[2],
            "category": row[3],
            "comment": row[4],
            "images": json.loads(row[5]) if row[5] else [],
            "created_at": row[6],
            "expires_at": row[7],
            "status": row[8],
            "municipality_note": row[9]
        }
        
        # Filtro por distancia si se proporciona
        if lat and lng and radius_m:
            from math import radians, sin, cos, asin, sqrt
            R = 6371000
            dlat = radians(report["lat"] - lat)
            dlng = radians(report["lng"] - lng)
            a = sin(dlat/2)**2 + cos(radians(lat)) * cos(radians(report["lat"])) * sin(dlng/2)**2
            d = 2 * R * asin(sqrt(a))
            if d > radius_m:
                continue
        
        reports.append(Report(**report))
    
    return reports

@app.get("/api/reports/{report_id}", response_model=Report)
def get_report(report_id: str):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT * FROM reports WHERE id = ?", (report_id,))
    row = c.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="Report not found")
    
    import json
    report = {
        "id": row[0],
        "lat": row[1],
        "lng": row[2],
        "category": row[3],
        "comment": row[4],
        "images": json.loads(row[5]) if row[5] else [],
        "created_at": row[6],
        "expires_at": row[7],
        "status": row[8],
        "municipality_note": row[9]
    }
    
    return Report(**report)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

