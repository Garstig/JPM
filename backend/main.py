import eel
from datetime import datetime, date, time
from database import Database
from models import Person, Projekt, TimeLog

db = Database('data.json')

# Initialize the Eel app
eel.init("frontend/public")

# --- Person Functions ---
@eel.expose
def get_persons():
    return [person.dict() for person in db.get_persons()]

@eel.expose
def add_person(surname, first_name, email=None, phone=None, workplace=None):
    person = Person(
        surname=surname,
        first_name=first_name,
        email=email,
        phone=phone,
        workplace=workplace
    )
    return db.add_person(person)

@eel.expose
def update_person(person_id, surname, first_name, email=None, phone=None, workplace=None):
    person = Person(
        surname=surname,
        first_name=first_name,
        email=email,
        phone=phone,
        workplace=workplace
    )
    db.update_person(int(person_id), person)
    return "Person updated!"

@eel.expose
def delete_person(person_id):
    db.delete_person(int(person_id))
    return "Person deleted!"

# --- Time Logs Functions ---
@eel.expose
def get_time_logs(year, month):
    logs = db.get_time_logs(int(year), int(month))
    return [log.dict() for log in logs]

@eel.expose
def add_time_log(date_str, start_time_str, end_time_str, name, description):
    time_log = TimeLog(
        date=date.fromisoformat(date_str),
        start_time=time.fromisoformat(start_time_str),
        end_time=time.fromisoformat(end_time_str),
        name=name,
        description=description
    )
    return db.add_time_log(time_log)

@eel.expose
def delete_time_log(time_log_id):
    db.delete_time_log(int(time_log_id))
    return "Time log deleted!"

@eel.expose
def update_time_log(time_log_id, date_str, start_time_str, end_time_str, name, description):
    time_log = TimeLog(
        date=date.fromisoformat(date_str),
        start_time=time.fromisoformat(start_time_str),
        end_time=time.fromisoformat(end_time_str),
        name=name,
        description=description
    )
    db.update_time_log(int(time_log_id), time_log)
    return "Time log updated!"

# --- Project Functions ---
@eel.expose
def get_projects():
    return [project.dict() for project in db.get_projects()]

@eel.expose
def add_project(data):
    name = data['name']
    kunde = data['kunde']
    redaktion = data['redaktion']
    kontaktperson = data['kontaktperson']
    vereinbartes_honorar = data['vereinbartes_honorar']
    prognosetage = data['prognosetage']
    projektart = data['projektart'] 
    rechnungsnummer = data['rechnungsnummer']
    
    if vereinbartes_honorar is not None:
        vereinbartes_honorar = float(vereinbartes_honorar)
    if prognosetage is not None:
        prognosetage = int(prognosetage)
    project = Projekt(
        name = name,
        kunde=kunde,
        redaktionsteam=redaktion,
        kontaktperson=kontaktperson,
        vereinbartes_honorar=vereinbartes_honorar,
        prognosetage=prognosetage,
        projektart=projektart,
        rechnungsnummer=rechnungsnummer
    )
    return db.add_project(project)

@eel.expose
def delete_project(project_id):
    db.delete_project(int(project_id))
    return "Project deleted!"

@eel.expose
def update_project(project_id, client, editorial_team, contact_person, agreed_fee, forecast_days):
    project = Project(
        client=client,
        editorial_team=editorial_team,
        contact_person=contact_person,
        agreed_fee=float(agreed_fee),
        forecast_days=int(forecast_days)
    )
    db.update_project(int(project_id), project)
    return "Project updated!"

# Eel app startup arguments
eel_kwargs = dict(
    host='localhost',
    port=8080,
    size=(1280, 800),
)

# Start the app
eel.start("index.html", **eel_kwargs)
