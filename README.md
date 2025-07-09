# Developer Portfolio

This is my personal developer portfolio website, showcasing my skills, achievements, and projects as a budding backend and full-stack developer.

### Frontend
- **HTML5**: Structured sections including Home, Services, Portfolio, and Contact for seamless navigation.
- **CSS3**: Modern and responsive design with animations, a dark theme, and vibrant accent colors for an engaging user experience.
- **JavaScript**:
  - Smooth scrolling and active navigation highlighting based on the scroll position.
  - Dynamic text animations using `Typed.js` for roles such as "Frontend Developer," "Java Developer," and "Database Administrator."
  - Scroll animations with `ScrollReveal` to enhance user interactivity.

### Backend
- **Node.js**: Server-side logic to handle contact form submissions and route management.
- **Express.js**: Framework for routing and middleware setup.
- **MySQL**: Database integration for storing contact form data with a robust table structure using `mysql2` and connection pooling.

### Contact Form
- A fully functional contact form with real-time validation.
- Backend integration to store user-submitted information in a MySQL database.

### Responsive Design
- Fully responsive across all devices, ensuring accessibility and usability for all users.

---

## Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript, Font Awesome.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL (via mysql2).
- **Hosting**: Railway.

---

## Environment Variables

Create a `.env` file in the root of your project with the following:

```env
PORT=3000
MYSQL_HOST=your-mysql-host
MYSQL_PORT=your-mysql-port
MYSQL_USER=your-mysql-user
MYSQL_PASSWORD=your-mysql-password
MYSQL_DATABASE=your-database-name
Deployment
Visit the live website: Developer Portfolio

Start Commands
bash
Copy
Edit
# Install dependencies
npm install

# Start the server
npm start

# OR for development with hot-reload
npm run dev
json
Copy
Edit
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
Author
Kanishk Pardikar
