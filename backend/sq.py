import os
import sqlite3

# Use the actual local directory path
folder_path = r"hackShristi\\backend\\documents"  # Change this to the actual full path if needed

# Connect to SQLite database
conn = sqlite3.connect('hackShristi\\backend\\database.db')
cursor = conn.cursor()

# Loop through all files in the directory
for filename in os.listdir(folder_path):
    file_path = os.path.join(folder_path, filename)

    # Make sure it's a file (not a folder)
    if os.path.isfile(file_path):
        try:
            # Read file content
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Insert into database
            cursor.execute('''
                INSERT INTO document (filename, content)
                VALUES (?, ?)
            ''', (filename, content))

            print(f"Inserted: {file_path}")
        except Exception as e:
            print(f"Failed to insert {file_path}: {e}")

# Commit and close
conn.commit()
conn.close()

print("All files inserted successfully.")
