from flask import Flask, jsonify, request, send_from_directory, render_template
import psycopg2

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/projects')
def projects():
    return render_template('views/projects/list.html')



@app.route('/api/data', methods=['GET'])
def get_data():
    data = {
        'message': 'This is a sample API endpoint',
        'status': 'success'
    }
    return jsonify(data)

@app.route('/api/data', methods=['POST'])
def post_data():
    data = request.json
    return jsonify({'received': data}), 201




#connect to the database of the user 
@app.route('/connect', methods=['POST'])
def connect():
    #we will get the data of the user
    host = request.form['host']
    port = request.form['port']
    database = request.form['database']
    user = request.form['user']
    password = request.form['password']
    
    try:
        conn = psycopg2.connect(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password
        )
        cursor = conn.cursor()

        # Obtener el listado de tablas
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        """)
        tables = cursor.fetchall()

        # Para cada tabla, obtener sus columnas y contenidos
        tables_data = {}
        for table in tables:
            table_name = table[0]
            # Obtener las columnas de la tabla
            cursor.execute(f"SELECT column_name FROM information_schema.columns WHERE table_name = '{table_name}';")
            columns = cursor.fetchall()

            # Obtener los datos de la tabla
            cursor.execute(f"SELECT * FROM {table_name};")
            rows = cursor.fetchall()

            tables_data[table_name] = {
                'columns': [column[0] for column in columns],
                'rows': rows
            }

        cursor.close()
        conn.close()

        # Renderizar los datos en una plantilla
        print(tables_data)
        return render_template('index.html', tables=tables_data)
    except Exception as e:
        return f"Error al conectar: {e}"

if __name__ == '__main__':
    app.run(debug=True)
