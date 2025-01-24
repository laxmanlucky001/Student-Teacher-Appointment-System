# Student-Teacher Booking Appointment

A web application that enables students to search for teachers, book appointments, and communicate with them. Teachers can manage their profiles, approve student appointments, and respond to messages.

### Technologies Used:
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Firebase (Authentication, Firestore Database, Hosting)
- **Hosting**: Firebase Hosting

### Domain: 
**Education**

---

## Features:

### Teacher Features:
- **Add Teacher**: Add teacher's details including Name, Department, Subject, etc.
- **Update/Delete Teacher Information**: Teachers can manage and update their profiles, including deletion.
- **Approve Student Registration**: Teachers can approve or reject student appointment requests.
- **View Appointments**: Teachers can see and manage all scheduled appointments.
- **View Messages**: Teachers can read and respond to messages from students.

### Student Features:
- **Register/Login**: Students can register and log in to the platform.
- **Search Teachers**: Students can search for teachers based on name, department, and subject.
- **Book Appointment**: Students can schedule an appointment with their chosen teacher.
- **Send Message**: Students can send messages directly to the teachers.
- **View Appointments**: Students can track and manage their scheduled appointments.
- **Logout**: Students can log out of the platform when needed.

---

## Project Evaluation Metrics:

### Code:
- **Safe**: Code is designed to prevent exposure of sensitive information like API keys.
- **Testable**: The app's functionality can be tested at various levels (unit, integration).
- **Maintainable**: The code structure allows for easy updates and management of features as the app scales.
- **Portable**: The project works consistently across different operating systems and environments.

### Database:
- Managed using **Firebase Firestore**, securely storing teacher and student data as well as appointments and messages.

### Logging:
- Error and action logs are tracked to monitor performance and issues.

### Deployment:
- Hosted on **Firebase Hosting**, with live access to all features at:  
  [Student-Teacher Booking Appointment](https://student-teacher-booking-cd647.web.app/)

## Installation & Setup:

1. Clone the repository:
    ```bash
    git clone https://github.com/Prathameshk11/Student-Teacher-Appointment-System.git
    ```
   
2. Navigate to the project folder:
    ```bash
    cd student-teacher-booking-appointment
    ```

3. Install necessary dependencies:
    ```bash
    npm install
    ```

4. Set up your Firebase project:
    - Create a Firebase project from [Firebase Console](https://console.firebase.google.com/).
    - Add your Firebase configuration in the `.env` file (ensure the `.env` file is not tracked in Git).

5. Run the project locally:
    ```bash
    npm run dev
    ```

---

## Code Organization:

### Firebase Configuration:
All Firebase-specific configurations (such as API keys and auth settings) are stored in the `firebase.js` file.

### Modular Architecture:
- **components**: Reusable UI components.
- **services**: Code for interacting with Firebase (e.g., Authentication, Firestore).
- **views**: User-specific pages like Register, Login, Teacher Dashboard, etc.
- **assets**: Static resources like images, icons, and CSS files.

---

## Contributing:

Feel free to fork this repository and contribute! If you see any bugs or areas of improvement, open an issue or a pull request.

---

## License:

This project is open-source and available under the [MIT License](LICENSE).

---

## Acknowledgements:
- **Firebase** for providing authentication and hosting.
- **FontAwesome** for beautiful icons.

---

### Live Demo:
You can try out the live version of the application here:
[Student-Teacher Booking Appointment Live Demo](https://student-teacher-booking-cd647.web.app/)

---

