Music Recommendation Web App 🎵

This is a Node.js-based web application that allows users to upload music, manage content, and receive music recommendations. The app supports user registration, login, and features dynamic interaction with a backend database using custom controllers and models.

🔧 Features

🎼 Upload and manage music files

🧠 Get music recommendations

💬 Comment system

👤 User registration and authentication

📂 File validation

📄 SQL database setup with schema and seed data

🧩 Modular architecture with controllers, models, and validators

📁 Project Structure

graphql
Copy
Edit
java-app-project/
├── Controllers/           # Handles route logic (comments, music, recommendations, users)
├── Models/                # Database models for each resource
├── Validators/            # Input validation for files, users, etc.
├── Database/
│   ├── init-db.js         # DB initialization script
│   └── schema.sql         # SQL schema definition
├── public/                # Static frontend HTML pages
├── server.js              # Main server file
├── package.json           # Dependencies
├── to_do.txt              # Project planning notes

🚀 Getting Started

Prerequisites
Node.js v18+

npm

MySQL (or another SQL-compatible DB if you adapt it)

Installation
bash
Copy
Edit
git clone https://github.com/gav-cooper/java-app-project.git
cd java-app-project
npm install
Database Setup
Create a database.

Run the SQL script:

bash
Copy
Edit
mysql -u youruser -p yourdatabase < Database/schema.sql
Seed using init-db.js if applicable.

Running the App
bash
Copy
Edit
node server.js
Then open your browser to http://localhost:3000.

🌐 Available Pages
/login.html

/register.html

/main.html

/logout.html

🧠 Future Enhancements

OAuth or JWT authentication

RESTful API endpoints

Real-time recommendations using ML

Improved frontend with React/Vue

📄 License

This project is licensed under the MIT License.
