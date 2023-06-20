<p align="center">
<img src="https://github.com/sdywa/event-planner-aspnet/assets/73535285/9ed5978b-a9b1-46c8-9fdb-e6979890a69a" width="200" />
<h1 align="center">Event Planner</h1>
<div align="center">A simple event planning app for a graduation project.</div>
<div align="center">
    <br />
    <a href="https://www.youtube.com/embed/JqYuK6JN8K4">
        <img src="https://i.imgur.com/NbP3aY2.png" width="720" />
    </a>
</div>
</p>

## Prerequisites
Before you begin, ensure that you have the following prerequisites installed:
- [Git](https://git-scm.com/downloads)
- [.NET 6 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)
- [MariaDB](https://mariadb.org/download) (make sure the MariaDB server is up and running)
- [Node.js](https://nodejs.org/en/download) (comes with [npm](https://www.npmjs.com))

## Getting Started
To run this application, follow these steps:
### 1. Clone the Repository
Open a terminal or command prompt and clone the repository using the following command:
```bash
git clone https://github.com/sdywa/event-planner-aspnet.git
```
### 2. Install Dependencies
Navigate to the project's root directory using a terminal or command prompt:
```bash
cd event-planner-aspnet
```
#### Backend
Install the backend dependencies by running the following commands:
```bash
cd EventPlanner
dotnet restore
```
#### Frontend
Navigate to the frontend folder and install the dependencies by running the following commands:
```bash
cd event-planner-front
npm install
```
### 3. Set Up the Database
Once the MariaDB server is configured, update the connection string in the `appsettings.Development.json` file located in the `EventPlanner` folder of the project. Replace `user id` and `password` values with your MariaDB server details.
```json
"ConnectionStrings": {
    "DefaultConnection": "server=localhost;user id=root;password=root;database=planner.mariadb"
}
```
### 4. Build and Run the Application
#### Backend
To build and run the backend application, execute the following command in the `EventPlanner` folder:
```bash
dotnet run
```
Wait for the command to complete. Once the backend application has started, you should see output similar to the following:
```vbnet
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:7222
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5063
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Development
info: Microsoft.Hosting.Lifetime[0]
      Content root path: /home/ale/Downloads/event-planner-aspnet/EventPlanner/
```
#### Frontend
To build and run the React.js frontend, execute the following command in the `event-planner-frontend` folder:
```bash
npm start
```
Wait for the command to complete. Once the frontend application has started, you should see output indicating that the development server is running.
### 5. Access the Application
Open your web browser and navigate to `http://localhost:3000`. You should see the frontend of the application. The frontend will communicate with the backend API running at `https://localhost:7222`.
