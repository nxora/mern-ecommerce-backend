# 🍨 Parfait Bliss — Backend API  
**Secure • Scalable • Modern Node.js + Express API**

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Backend-Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/Auth-JWT-black?style=for-the-badge&logo=jsonwebtokens"/>
  <img src="https://img.shields.io/badge/Deployed%20On-Render-blue?style=for-the-badge&logo=render&logoColor=white"/>
</p>

---

## 🚀 Overview  
Parfait Bliss Backend is a production-ready **REST API** powering the Parfait Bliss eCommerce experience.  
Built with **Express**, **MongoDB**, and **JWT Authentication**, this API handles:

- 🔐 User registration, login, and email verification  
- 📦 Product management (future admin panel)  
- 🛒 Cart + Checkout support (WhatsApp order integration)  
- 🔑 Google OAuth login  
- 🧾 Secure JWT-protected routes  
- 📡 Fully deployable to Render

---

## 🛠️ Tech Stack  

| Layer            | Technology |
|------------------|------------|
| Backend Framework | **Node.js + Express** |
| Database         | **MongoDB + Mongoose** |
| Authentication   | **JWT + bcryptjs + Google OAuth** |
| Email Service    | **Nodemailer** |
| Deployment       | **Render** |
| Security         | bcryptjs, JWT |

---

## 📁 Project Structure

```
backend/
│── auth/
│── models/
│── index.js
│── package.json
│── .env
```

---

## 🔐 Authentication Flow  

### ✔️ Email/Password Register  
- Stores hashed passwords using `bcryptjs`  
- Generates `verificationToken`  
- Sends email verification link  
- Issues JWT after verify  

### ✔️ Login  
- Validates credentials  
- Checks email verification  
- Sends signed JWT (`7 days expiry`)  

### ✔️ Google OAuth Login  
- Uses Google ID Token  
- Creates user if not existing  
- Returns JWT  

---

## 🔰 Protected Routes (JWT Middleware)

```js
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
```

This middleware protects endpoints like `/api/checkpont`, `/api/cart`, etc.

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/nxora/mern-ecommerce-backend.git
cd mern-ecomerce-backend/server
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Add environment variables  
Create a `.env` file:

```
Check out .en.example for more details
```

### 4️⃣ Start server
```bash
nodemon index.js
```

Server will run at:

```
http://localhost:5000
```

---

## 🚀 Deployment (Render)

1. Push repository to GitHub  
2. Go to **Render → New Web Service**  
3. Connect repository  
4. Set:
   - Build Command → `npm install`
   - Start Command → `npm start`  
5. Add environment variables  
6. Deploy

Your API will be live at:

```
https://your-render-service-url
```

---

## 🧪 API Endpoints

### **Auth**
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/auth/register` | Create user + email verify |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get logged-in user |
| GET | `/api/auth/verify/:token` | Verify email |
| POST | `/api/auth/google` | Google OAuth |

### **Products** (Soon)
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/menu` | Fetch all products |
| POST | `/api/products` | Add product (admin only) |

---

## 📝 Roadmap  
- [ ] Admin Dashboard  
- [ ] Product CRUD  
- [ ] Order tracking system  
- [ ] Inventory management  
- [ ] Stripe/Paystack integration  

---

## ❤️ Credits  
Developed with passion by **Parfait Bliss Team** — powered by modern Node.js engineering.
- Dev — [Nexora](https://github.com/nxora) 
- Figma — [FIgma File](https://www.figma.com/design/vkcDQmjblgS7lFWIvclVCj/Parfait-Website?node-id=60-393&t=eC9Da9VIqPGxjw0f-0)
- Credit — [Thanks to](https://github.com/ojoilesanmi)

---

## 📜 License  
MIT License.

---

