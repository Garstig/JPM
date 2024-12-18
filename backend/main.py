import eel
from database import Database

db = Database("db.sqlite")

# Initialisiere die Eel-App
eel.init("frontend/public")

@eel.expose
def get_appointments(year, month):
    return db.get_appointments(year, month)

@eel.expose
def add_appointment(date, start_time, end_time, name, description):
    db.add_appointment(date, start_time, end_time, name, description)
    return "Appointment added!"

@eel.expose
def delete_appointment(appointment_id):
    db.delete_appointment(appointment_id)
    return "Appointment deleted!"


eel_kwargs = dict(
        host='localhost',
        port=8080,
        size=(1280, 800),
    )
# Starte die App
eel.start("index.html", **eel_kwargs)


