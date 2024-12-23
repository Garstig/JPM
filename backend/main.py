import eel
from database import Database

db = Database("db.sqlite")

# Initialize the Eel app
eel.init("frontend/public")

# --- time_logs Functions ---
@eel.expose
def get_time_logs(year, month):
    return db.get_time_logs(year, month)

@eel.expose
def add_time_log(date, start_time, end_time, name, description):
    db.add_time_log(date, start_time, end_time, name, description)
    return "time_log added!"

@eel.expose
def delete_time_log(time_log_id):
    db.delete_time_log(time_log_id)
    return "time_log deleted!"

@eel.expose
def update_time_log(time_log_id, date, start_time, end_time, name, description):
    db.update_time_log(time_log_id, date, start_time, end_time, name, description)
    return "time_log updated!"

# --- Projects Functions ---
@eel.expose
def get_projects():
    return db.get_projects()

@eel.expose
def add_project(client, editorial_team, contact_person, agreed_fee, forecast_days, 
                contract_number, topic, category, vg_word_relevant, vg_image_relevant, 
                publication_date, work_link):
    db.add_project(client, editorial_team, contact_person, agreed_fee, forecast_days,
                   contract_number, topic, category, vg_word_relevant, vg_image_relevant,
                   publication_date, work_link)
    return "Project added!"

@eel.expose
def delete_project(project_id):
    db.delete_project(project_id)
    return "Project deleted!"

@eel.expose
def update_project(project_id, client, editorial_team, contact_person, agreed_fee, forecast_days, 
                   contract_number, topic, category, vg_word_relevant, vg_image_relevant, 
                   publication_date, work_link):
    db.update_project(project_id, client, editorial_team, contact_person, agreed_fee, forecast_days,
                      contract_number, topic, category, vg_word_relevant, vg_image_relevant,
                      publication_date, work_link)
    return "Project updated!"

# Eel app startup arguments
eel_kwargs = dict(
    host='localhost',
    port=8080,
    size=(1280, 800),
)

# Start the app
eel.start("index.html", **eel_kwargs)
