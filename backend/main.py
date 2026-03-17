from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

reports = [
    {
        "id": 1,
        "phone": "+254700111222",
        "district": "Kisumu",
        "crop": "Maize",
        "symptom": "Brown leaf spots",
        "severity": "High",
        "date": "2026-03-17",
        "status": "Pending"
    }
]

alerts = [
    {
        "id": 1,
        "district": "Kisumu",
        "message": "Possible maize disease outbreak detected.",
        "date": "2026-03-17",
        "status": "Sent"
    }
]

@app.get("/")
def read_root():
    return {"message": "Umoja backend is running"}

@app.get("/reports")
def get_reports():
    return reports

@app.post("/reports")
def create_report(report: dict):
    new_report = {
        "id": len(reports) + 1,
        "phone": report["phone"],
        "district": report["district"],
        "crop": report["crop"],
        "symptom": report["symptom"],
        "severity": report["severity"],
        "date": report["date"],
        "status": "Pending"
    }
    reports.append(new_report)
    return new_report

@app.put("/reports/{report_id}/verify")
def verify_report(report_id: int):
    for report in reports:
        if report["id"] == report_id:
            report["status"] = "Verified"
            return report
    return {"error": "Report not found"}

@app.put("/reports/{report_id}/reject")
def reject_report(report_id: int):
    for report in reports:
        if report["id"] == report_id:
            report["status"] = "Rejected"
            return report
    return {"error": "Report not found"}

@app.get("/alerts")
def get_alerts():
    return alerts

@app.post("/alerts")
def create_alert(alert: dict):
    new_alert = {
        "id": len(alerts) + 1,
        "district": alert["district"],
        "message": alert["message"],
        "date": alert["date"],
        "status": "Sent"
    }
    alerts.append(new_alert)
    return new_alert