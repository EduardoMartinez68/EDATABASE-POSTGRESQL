from flask import Flask, jsonify, request, send_from_directory, render_template
import psycopg2

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

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
        conn.close()
        return "Conexión exitosa!"
    except Exception as e:
        return f"Error al conectar: {e}"

if __name__ == '__main__':
    app.run(debug=True)
