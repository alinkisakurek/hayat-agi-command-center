## A Web-Based Management and Visualization Interface for a Resilient Disaster Communication Network.

This project serves as the central nervous system for the "Hayat Ağı" mesh network, providing real-time visualization, device management, and situational awareness for disaster response teams.

---

## 🚀 Project Progress: Sprint 1-3 (Initial Setup & Architecture)

We have successfully completed the initial phase of the project, focusing on establishing the development environment, designing the system architecture, and setting up the core MERN stack structure.

<img width="963" height="692" alt="Ekran Resmi 2025-11-21 11 40 17" src="https://github.com/user-attachments/assets/e3e0c715-372e-4990-b5e8-f4492b6b2a90" />
*(Snapshot of our Product Backlog completion status as of Nov 14, 2025)*

### ✅ Completed Milestones

**Architecture & Design**
- [x] **Project Proposal & Scope:** Defined functional and non-functional requirements.
- [x] **API Contract Design:** Designed comprehensive API specifications using Postman (Auth & Gateway endpoints).
- [x] **Database Design:** Drafted Mongoose schemas for `User` (RBAC) and `Gateway` models.

**Backend (Node.js/Express)**
- [x] **Environment Setup:** Initialized Node.js project with basic folder structure (controllers, routes, models).
- [x] **Database Connection:** Configured MongoDB Atlas connection.
- [x] **Core Implementation:** Created Mongoose models and implemented dummy logic for Authentication endpoints.

**Frontend (React/Vite)**
- [x] **Initialization:** Set up React project with Vite and established folder structure.
- [x] **UI Foundation:** Integrated Material-UI component library and configured the global theme.
- [x] **GIS Research:** Conducted research on Leaflet and Mapbox for the mapping interface.

---
Sprint 1-3 Progress Report: Core Setup & Interfaces
1. Design and Planning (Completed) We started the process by defining the project architecture and user flows.

Wireframing: I sketched wireframes for the Landing Page and Dashboard to clarify exactly how the UI would look.

![WhatsApp Image 2025-11-21 at 18 20 21 (1)](https://github.com/user-attachments/assets/9b83642f-2c8d-47a5-ae04-b6e679d4fb18)
![WhatsApp Image 2025-11-21 at 18 20 22 (1)](https://github.com/user-attachments/assets/40cbac88-1ee1-423d-a395-23acbc5f2806)


Task Planning: We organized the entire process and sprint distribution using Miro.

<img width="1015" height="1059" alt="Screenshot 2025-11-26 092351" src="https://github.com/user-attachments/assets/11ec9a74-6349-4690-8894-1ba522235df0" />

2. Frontend Development - MVP (Completed) We brought the planned design to life using React and Material-UI.

Public Interface: A modern Landing Page, Solutions, and Support pages have been created.

Authentication: Login and Register pages are complete, including form validation and role-based routing (Admin vs. Citizen).

Admin Dashboard: A responsive management panel skeleton featuring a Sidebar and Topbar has been established.

Gateway Management: Modules for listing devices, filtering (Active/Inactive/Battery), and adding new devices are finished.

3. Backend & Integration (Completed)

The Node.js/Express infrastructure was set up, and API connections with the Frontend were established via Axios.

A "Mock Fallback" structure was implemented for data fetching operations, ensuring the system remains functional under all conditions.

🚧 What's Next?
Currently, the system's management, listing, and user authentication modules are fully ready.

One Major Task Remaining: Map Visualization (Live Map) integration.

In the next step, we will complete the visualization aspect of the project by pinning gateway devices on a map using Leaflet/Mapbox
## ⚙️ Installation & Run Instructions

This project utilizes a **MERN Stack** (MongoDB, Express, React, Node.js) structure. Follow the steps below to set up and run the application locally.

### Prerequisites
* Node.js (v16 or higher)
* MongoDB (Local instance or Atlas URI)

---

### 1. Backend Setup (Server)
The backend service handles API requests and database connections.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install server dependencies:
    ```bash
    npm install
    ```
3.  **Environment Variables:** Create a `.env` file in the `backend/` root directory and add your configuration (see the *.env Example* section below).
4.  Start the server:
    ```bash
    npm run dev
    ```
    > *Server will run on: `http://localhost:5000`*

---

### 2. Frontend Setup (Client)
The React application (built with Vite) serves the user interface.

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install client dependencies (Required for Material UI & Axios):
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    > *Application will open at: `http://localhost:5173`*

---

### 🔐 Environment Variables (.env)

For the backend to function correctly, create a `.env` file in the `backend/` folder with the following keys:

```text
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hayatagi_db
JWT_SECRET=your_secret_key_here

## 👥 Development Team

| Role | Name |
| :--- | :--- |
| **Backend Architect & Project Lead** | Alin Kısakürek |
| **Backend Developer** | Ahmet Karakoyun |
| **Frontend Lead** | Berke Kuş |
| **Visualization Specialist** | Göksu Bulut |

---

## 🛠 Tech Stack

- **Frontend:** React, Vite, Material-UI, Leaflet/Mapbox
- **Backend:** Node.js, Express.js
- **Database:** MongoDB 
- **Tools:** Postman, Miro, GitHub

---
*Last Updated: November 21, 2025*
