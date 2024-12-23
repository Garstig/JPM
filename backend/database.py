import sqlite3

class Database:
    def __init__(self, db_name):
        self.conn = sqlite3.connect(db_name)
        self.create_tables()

    def create_tables(self):
        # Create time_logs table
        self.conn.execute("""
        CREATE TABLE IF NOT EXISTS time_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            start_time TEXT,
            end_time TEXT,
            name TEXT,
            description TEXT
        );
        """)

        # Create projects table
        self.conn.execute("""
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT, -- Projekt-ID
            client TEXT, -- Kunde
            editorial_team TEXT, -- Redaktion
            contact_person TEXT, -- Ansprechperson
            agreed_fee REAL, -- Vereinbartes Honorar
            forecast_days INTEGER, -- Prognosetage
            contract_number TEXT, -- Vertragsnummer
            topic TEXT, -- Thema
            category TEXT, -- Klasse
            vg_word_relevant BOOLEAN, -- VG Wort relevant
            vg_image_relevant BOOLEAN, -- VG Bild relevant
            publication_date TEXT, -- Veröffentlichkeitsdatum
            work_link TEXT -- Link zum Werk
        );
        """)
        self.conn.commit()

    # Methods for projects table
    def add_project(self, client, editorial_team, contact_person, agreed_fee, forecast_days, 
                    contract_number, topic, category, vg_word_relevant, vg_image_relevant, 
                    publication_date, work_link):
        query = """
        INSERT INTO projects (
            client, editorial_team, contact_person, agreed_fee, forecast_days, contract_number,
            topic, category, vg_word_relevant, vg_image_relevant, publication_date, work_link
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        self.conn.execute(query, (client, editorial_team, contact_person, agreed_fee, forecast_days,
                                  contract_number, topic, category, vg_word_relevant, vg_image_relevant,
                                  publication_date, work_link))
        self.conn.commit()

    def get_projects(self):
        query = """
        SELECT id, client, editorial_team, contact_person, agreed_fee, forecast_days, 
               contract_number, topic, category, vg_word_relevant, vg_image_relevant, 
               publication_date, work_link
        FROM projects
        """
        cursor = self.conn.execute(query)

        # Fetch all results and convert each row into a dictionary
        columns = [desc[0] for desc in cursor.description]
        projects = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return projects

    def delete_project(self, project_id):
        query = "DELETE FROM projects WHERE id = ?"
        self.conn.execute(query, (project_id,))
        self.conn.commit()

    def update_project(self, project_id, client, editorial_team, contact_person, agreed_fee, forecast_days, 
                       contract_number, topic, category, vg_word_relevant, vg_image_relevant, 
                       publication_date, work_link):
        query = """
        UPDATE projects 
        SET client = ?, editorial_team = ?, contact_person = ?, agreed_fee = ?, forecast_days = ?, 
            contract_number = ?, topic = ?, category = ?, vg_word_relevant = ?, 
            vg_image_relevant = ?, publication_date = ?, work_link = ?
        WHERE id = ?
        """
        self.conn.execute(query, (client, editorial_team, contact_person, agreed_fee, forecast_days,
                                  contract_number, topic, category, vg_word_relevant, vg_image_relevant,
                                  publication_date, work_link, project_id))
        self.conn.commit()
    
    def get_time_logs(self, year, month):
        query = """
        SELECT id, date, start_time, end_time, name, description 
        FROM time_logs 
        WHERE strftime('%Y', date) = ? AND strftime('%m', date) = ?
        """
        cursor = self.conn.execute(query, (str(year), f"{int(month):02}"))

        # Fetch all results and convert each row into a dictionary
        columns = [desc[0] for desc in cursor.description]  # Get column names from cursor description
        time_logs = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return time_logs

    def add_time_log(self, date, start_time, end_time, name, description):
        query = """
        INSERT INTO time_logs (date, start_time, end_time, name, description) 
        VALUES (?, ?, ?, ?, ?)
        """
        self.conn.execute(query, (date, start_time, end_time, name, description))
        self.conn.commit()

    def delete_time_log(self, time_log_id):
        query = "DELETE FROM time_logs WHERE id = ?"
        self.conn.execute(query, (time_log_id,))
        self.conn.commit()

    def update_time_log(self, time_log_id, date, start_time, end_time, name, description):
        query = """
        UPDATE time_logs 
        SET date = ?, start_time = ?, end_time = ?, name = ?, description = ?
        WHERE id = ?
        """
        self.conn.execute(query, (date, start_time, end_time, name, description, time_log_id))
        self.conn.commit()
