---

# 🌐 PyCesiumProject

Welcome to **PyCesiumProject**! This is a full-stack project with:

- **Frontend**: Built using **React.js** and **Vite**
- **Backend**: Developed in **Python** using **FastAPI** and **Uvicorn**
- **Database**: MySQL, with the database name: `sdh_system`

All Python dependencies are listed in the `requirements.txt` file and can be installed easily.

---

## 📁 Project Structure

```
PyCesiumProject/
│
├── backend/               # Backend code (FastAPI)
├── frontend/              # Frontend code (React + Vite)
├── venv/                  # Python virtual environment
├── requirements.txt       # Python dependencies
├── README.md              # This file
└── script.sql             # SQL script to insert test data
```

---

## 🧰 Prerequisites

Before you begin, make sure you have the following installed on your **Windows** machine:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Python 3.10+](https://www.python.org/downloads/)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- [Git](https://git-scm.com/) (optional but recommended)

---

## 🚀 How to Run the Project

### 1. Clone or Open the Project

If you're cloning this repository:

```bash
git clone https://github.com/your-username/PyCesiumProject.git
cd PyCesiumProject
```

---

### 2. Set Up the MySQL Database

The database used in this project is called: **`sdh_system`**

1. Make sure MySQL is running locally.
2. Open the MySQL CLI or any MySQL client:

   ```bash
   mysql -u root -p
   ```

3. Create the database:

   ```sql
   CREATE DATABASE sdh_system;
   USE sdh_system;
   ```

4. Exit MySQL and import the provided SQL script to populate the database:

   ```bash
   mysql -u root -p sdh_system < script.sql
   ```

   or you paste the sql command in the terminal:
   <script.sql

   > ⚠️ If there are encoding issues, run this before importing:
   >
   > ```sql
   > SET NAMES 'utf8mb4';
   > ```

---

### 3. Configure and Start the Backend

1. Open a terminal inside the `backend/` folder.

2. Activate the Python virtual environment:

   ```bash
   cd backend
   ..\venv\Scripts\activate
   ```

3. Install dependencies from `requirements.txt`:

   ```bash
   pip install -r ../requirements.txt
   ```

4. Start the FastAPI server:

   ```bash
   uvicorn main:app --reload
   ```

> The backend will now be available at: `http://localhost:8000`

---

### 4. Configure and Start the Frontend

1. Open another terminal inside the `frontend/` folder.

2. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

> The frontend will now be available at: `http://localhost:5173` (or the port shown in the console).

---

## 🛑 Stop the Servers

To stop both servers:

- In the backend terminal: press `Ctrl + C`
- In the frontend terminal: press `Ctrl + C`
- Deactivate the Python virtual environment (in backend):

  ```bash
  deactivate
  ```

---

## 💡 Important Notes

- Ensure ports **8000** (FastAPI) and **5173** (Vite) are free.
- Adjust the database connection string in `backend/main.py` if needed.
- You can use tools like **MySQL Workbench** or **phpMyAdmin** for easier DB management.

---

## 📦 Bonus: Installing Dependencies from `requirements.txt`

This project uses a standard `requirements.txt` file to manage Python dependencies.

### To install all dependencies:

```bash
pip install -r requirements.txt
```

This command installs all required packages in your current Python environment.

### Alternative: Using `pipenv`

If you prefer `pipenv`, you can generate a `Pipfile.lock` and export it:

```bash
pipenv lock -r > requirements.txt
```

Then install using:

```bash
pipenv install -r requirements.txt
```

### Alternative: Using `poetry`

If you're using `poetry`, you can export the locked dependencies:

```bash
poetry export -f requirements.txt --output requirements.txt
```

Then install them using:

```bash
pip install -r requirements.txt
```
