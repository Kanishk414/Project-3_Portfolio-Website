````markdown
# Developer Portfolio Website 🌐

This is my **personal developer portfolio website**, showcasing my skills, achievements, and projects as a budding backend and full-stack developer.

The project is **fully deployed on AWS** with the following production setup:

- **AWS EC2 (Ubuntu)** → Hosts the Node.js + Express app
- **AWS RDS (MySQL)** → Stores contact form submissions
- **AWS Route 53** → Domain & DNS management
- **Nginx** → Reverse proxy in front of Node.js
- **PM2** → Keeps the app running & restarts on reboot
- **Let’s Encrypt (Certbot)** → Free SSL (HTTPS) with auto-renewal

---

## 🚀 Features

- Responsive portfolio (HTML/CSS/JS)
- Backend API using **Node.js + Express**
- Contact form → persists messages in **RDS MySQL**
- **Nginx** reverse proxy on ports 80/443
- **HTTPS** via Let’s Encrypt
- Process management & auto-start via **PM2**

---

## 📦 Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript  
- **Backend:** Node.js, Express.js  
- **Database:** MySQL on AWS RDS  
- **Infra:** EC2, Route 53, Nginx, PM2, Certbot (Let’s Encrypt)

---

## 📁 API & App

- `POST /api/contact` → Save `{ fullName, email, mobileNumber?, message }` to DB  
- `GET  /api/health`  → Health check `{ ok: true, db: 'up' }` when DB reachable  
- Static frontend served from `/public` (SPA fallback to `public/index.html`)

---

## 🔐 Environment Variables

Create a `.env` in the project root:

```env
PORT=3000
MYSQL_HOST=<your-rds-endpoint>        # e.g., mydb.xxxxxx.ap-south-1.rds.amazonaws.com
MYSQL_PORT=3306
MYSQL_USER=<your-db-username>
MYSQL_PASSWORD=<your-db-password>
MYSQL_DATABASE=portfolio
````

> ✅ **No manual database creation required** — the server ensures the **database** and **table (`contact_messages`)** exist on startup.

---

## 🛠️ Local Development

```bash
git clone https://github.com/your-username/Project-3_Portfolio-Website.git
cd Project-3_Portfolio-Website
npm install
npm run start
# Open http://localhost:3000
```

---

## 🌍 Production Deployment (AWS)

### 1) Prerequisites

* AWS Account
* **EC2 Ubuntu** instance (allow inbound **22/80/443** in its Security Group)
* **RDS MySQL** instance

  * Inbound **3306** should allow your **EC2 Security Group** (recommended) or EC2 IP
* **Route 53** hosted zone + a domain (e.g., `yourdomain.com`)
* (Recommended) **Elastic IP** attached to EC2 (so your IP doesn’t change)

### 2) Install Runtime on EC2

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm nginx mysql-client
sudo npm install -g pm2
```

### 3) Clone & Configure App on EC2

```bash
cd ~
git clone https://github.com/your-username/Project-3_Portfolio-Website.git
cd Project-3_Portfolio-Website
nano .env           # paste the variables from the .env block above
npm install
```

### 4) Start the App with PM2

```bash
pm2 start server.js --name portfolio-app
pm2 status
pm2 logs portfolio-app
pm2 save
pm2 startup
# Follow the printed command, then:
pm2 save
```

* **Restart after code changes:** `pm2 restart portfolio-app`
* **Stop/Delete:** `pm2 stop portfolio-app` / `pm2 delete portfolio-app`

### 5) Nginx Reverse Proxy (HTTP → Node 3000)

Create site config:

```bash
sudo nano /etc/nginx/sites-available/portfolio
```

Paste:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable & reload:

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6) Route 53 DNS

* **A record** (root):

  * Name: `@`
  * Value: your EC2 **Elastic IP**
  * TTL: 300
* **A record** for `www` or **CNAME** → root:

  * Name: `www`
  * Value: `yourdomain.com`

Check DNS propagation:

```bash
dig +short yourdomain.com
dig +short www.yourdomain.com
```

Both should return your EC2 IP.

### 7) Enable HTTPS (Let’s Encrypt / Certbot)

Install Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Request certificates (replace with your actual domain):

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

* Enter email, agree to TOS
* Choose the option to **redirect HTTP to HTTPS** (Certbot will edit your Nginx file)

Test auto-renew:

```bash
sudo certbot renew --dry-run
```

Now visit: **[https://cloudexample.xyz](https://cloudexample.xyz)** ✅

---

## ✅ Health Checks

```bash
# App health
curl -s http://127.0.0.1:3000/api/health

# Nginx syntax & service
sudo nginx -t
sudo systemctl status nginx

# PM2 status & logs
pm2 status
pm2 logs portfolio-app
```

---

## 🧯 Troubleshooting

**Port already in use (EADDRINUSE: :3000)**
A previous instance is running.

```bash
sudo lsof -i :3000
kill -9 <PID>              # if needed
pm2 list
pm2 delete portfolio-app && pm2 start server.js --name portfolio-app
```

**Domain not loading**

* Route 53 **A records** must point to current EC2 (ideally Elastic IP)
* EC2 Security Group allows **80/443**
* Nginx `server_name` matches your domain

**Certbot fails (unauthorized/invalid response)**

* DNS for `yourdomain.com` and `www` must resolve to **this EC2 public IP**
* Port **80** open; Nginx serving your server block
* Re-run:

  ```bash
  sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
  ```

**RDS connection issues**

* RDS SG inbound **3306** allows **EC2 Security Group**
* Check `.env` credentials & host (`MYSQL_HOST=<rds-endpoint>`)

---

## 🔧 Useful Commands (Quick Reference)

**PM2**

```bash
pm2 start server.js --name portfolio-app
pm2 restart portfolio-app
pm2 stop portfolio-app
pm2 delete portfolio-app
pm2 list
pm2 logs portfolio-app
pm2 save
pm2 startup
```

**Nginx**

```bash
sudo nginx -t
sudo systemctl restart nginx
sudo journalctl -u nginx -n 100 --no-pager
```

**Ports & Processes**

```bash
sudo lsof -i :3000
sudo ss -tulpen | grep -E ':(80|443|3000)'
```

**Firewall (optional UFW)**

```bash
sudo ufw allow 80
sudo ufw allow 443
sudo ufw status
```

**MySQL from EC2 → RDS**

```bash
mysql -h <RDS-ENDPOINT> -u <MYSQL_USER> -p
```

---

## 👨‍💻 Author

**Kanishk Pardikar**

```
Full Stack Developer · Backend Enthusiast
```
