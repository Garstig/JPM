import sqlite3

class Database:
    def __init__(self, db_name):
        self.conn = sqlite3.connect(db_name)
        self.create_tables()

    def create_tables(self):
        query = """
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            start_time TEXT,
            end_time TEXT,
            name TEXT,
            description TEXT
        );
        """
        self.conn.execute(query)
        self.conn.commit()

    def get_appointments(self, year, month):
        query = """
        SELECT id, date, start_time, end_time, name, description 
        FROM appointments 
        WHERE strftime('%Y', date) = ? AND strftime('%m', date) = ?
        """
        cursor = self.conn.execute(query, (str(year), f"{int(month):02}"))

        # Fetch all results and convert each row into a dictionary
        columns = [desc[0] for desc in cursor.description]  # Get column names from cursor description
        appointments = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return appointments

    def add_appointment(self, date, start_time, end_time, name, description):
        query = """
        INSERT INTO appointments (date, start_time, end_time, name, description) 
        VALUES (?, ?, ?, ?, ?)
        """
        self.conn.execute(query, (date, start_time, end_time, name, description))
        self.conn.commit()

    def delete_appointment(self, appointment_id):
        query = "DELETE FROM appointments WHERE id = ?"
        self.conn.execute(query, (appointment_id,))
        self.conn.commit()

    def update_appointment(self, appointment_id, date, start_time, end_time, name, description):
        query = """
        UPDATE appointments 
        SET date = ?, start_time = ?, end_time = ?, name = ?, description = ?
        WHERE id = ?
        """
        self.conn.execute(query, (date, start_time, end_time, name, description, appointment_id))
        self.conn.commit()
