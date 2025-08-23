# Developer Portfolio Website 🌐

This is my **personal developer portfolio website**, showcasing my skills, achievements, and projects as a budding backend and full-stack developer.

The project is **fully deployed on AWS** with the following infrastructure setup:

- **AWS EC2** → Hosting the Node.js + Express application.
- **AWS RDS (MySQL)** → Used for storing contact form submissions.
- **AWS Route 53** → Domain management and DNS configuration.
- **Nginx** → Used as a reverse proxy for serving the application.
- **PM2** → Keeps the Node.js app running continuously and manages processes.

---

## 🚀 Features
- Modern responsive portfolio design.
- Backend powered by **Node.js + Express**.
- Contact form with entries stored in **AWS RDS MySQL**.
- Secure deployment with **Nginx** as a reverse proxy.
- Domain name configured with **AWS Route 53**.
- Background process management using **PM2**.

---

## 📦 Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: AWS RDS (MySQL)
- **Hosting**: AWS EC2
- **Domain & DNS**: AWS Route 53
- **Reverse Proxy**: Nginx
- **Process Manager**: PM2

---

## 🛠️ Deployment Process

### 1. Clone Repository
```bash
git clone [https://github.com/your-username/Project-3_Portfolio-Website.git]
cd Project-3_Portfolio-Website

### 2\. Install Dependencies

```bash
npm install
```

### 3\. Configure Environment

Create a `.env` file and configure:

```env
MYSQL_HOST=<your-rds-endpoint>
MYSQL_USER=<your-db-username>
MYSQL_PASSWORD=<your-db-password>
MYSQL_DATABASE=portfolio
PORT=3000
MYSQL_PORT=3306
```

### 4\. Start Application with PM2

```bash
pm2 start server.js --name portfolio-app
pm2 save
pm2 startup
```

### 5\. Setup Nginx as a Reverse Proxy

Edit Nginx config:

```bash
sudo nano /etc/nginx/sites-available/portfolio
```

Example config:

```nginx
server {
    listen 80;
    server_name Yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable config and restart:

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6\. Route 53 Setup

  - Registered domain → `yourdomain.com`.
  - Updated domain nameservers to Route 53.
  - Created an A record pointing to the EC2 public IP.

-----

### 📌 Notes

  - The application will auto-start on server reboot using PM2.
  - All contact form messages are saved in the AWS RDS MySQL database.
  - The domain name is configured with Route 53 for public access.

-----

### 👨‍💻 Author

```Kanishk Pardikar
Full Stack Developer | Backend Enthusiast
```
