# 🍽️ Taste of North - Restaurant Management System

A modern, full-stack restaurant ordering and reservation management system built with **Next.js**, **React**, and **TypeScript**. This application provides customers with a seamless ordering experience and provides restaurant staff with comprehensive order and reservation management tools.

---

## ✨ Features

### 🛍️ Customer Features
- **Browse Menu** - Explore restaurant menu with detailed item descriptions and pricing
- **Shopping Cart** - Add/remove items with real-time cart updates
- **Checkout** - Secure checkout process with order confirmation
- **Order Tracking** - Track orders in real-time using unique tracking tokens
- **Reservations** - Book tables and manage reservations
- **User Authentication** - Secure login/signup functionality

### 👨‍💼 Admin Features
- **Order Management** - View and manage all customer orders
- **Status Updates** - Track order status (pending, confirmed, preparing, ready, completed)
- **Reservation Management** - Manage table reservations and customer details
- **Dashboard** - Comprehensive admin panel for restaurant operations

### 💳 Payment
- **Stripe Integration** (optional) - Secure payment processing in test mode
- **Mock Payment Fallback** - Built-in demo payment flow when Stripe is not configured

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 14** | React framework with App Router |
| **React 18** | UI library |
| **TypeScript** | Type-safe development |
| **Stripe API** | Payment processing (optional) |
| **JSON Storage** | Development/demo data persistence |

---

## � Screenshots & Demo
HomePage:
<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/f4f4601d-a1d2-42c9-98d4-2cd2f78bcf89" />

Menu Page:
<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/f31a89ce-7253-4744-8a2e-b35495a8cd0e" />

Reservations Page:
<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/2b97752b-2bc2-42de-8f56-46b490d3caeb" />

Cart Page:
 <img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/84c53cce-e7ab-499e-80da-1315af47baaf" />

Orders Page:
<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/fe31abd6-5425-4621-a9a5-b665de7c7258" />






<!-- Screenshots:
### Home Page
![Home Page](./docs/screenshots/home.png)

### Menu Browsing
![Menu](./docs/screenshots/menu.png)

### Shopping Cart
![Cart](./docs/screenshots/cart.png)

### Admin Dashboard
![Admin](./docs/screenshots/admin.png)

### Order Tracking
![Order Tracking](./docs/screenshots/order-tracking.png)
-->

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Adyakumari/-Taste-of-north-restaurant-system.git
   cd taste-of-north
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

---

## 🔧 Environment Variables (Optional)

For **Stripe payment integration**, create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_SUCCESS_URL=http://localhost:3000/order/success
STRIPE_CANCEL_URL=http://localhost:3000/checkout?cancelled=1
```

**Note:** If Stripe keys are not configured, the app automatically uses a mock payment flow for testing.

---

## 📊 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript type checking
```

---

## 💾 Data Storage

### Development Mode
- **Orders**: Stored in `data/orders.json`
- **Reservations**: Stored in `data/reservations.json`
- **Menu**: Stored in `data/menu.json`

### Order Tracking
- Each order receives a unique 10-character tracking token
- Customers can share this token to track order status
- Tokens are secure and share-safe

### Production Considerations
⚠️ **For production deployment**, replace file-based JSON storage with:
- PostgreSQL/MySQL database
- MongoDB
- Firebase/Cloud Firestore
- AWS DynamoDB

---

## 🔐 Security Notes

- Never commit `.env.local` file to version control
- Use strong, unique API keys for production
- Implement proper authentication for admin routes
- Validate all user inputs on backend
- Use HTTPS in production
- Implement rate limiting for API routes

---

## 📝 API Endpoints

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[token]` - Get order by token
- `POST /api/admin/orders` - Update order status (admin)

### Reservations
- `GET /api/reservations` - Get all reservations
- `POST /api/reservations` - Create reservation
- `GET /api/reservations/[token]` - Get reservation by token

### Menu
- `GET /api/menu` - Get menu items

### Payment
- `POST /api/payment` - Process payment

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📧 Contact & Support

For questions or support, please reach out to the project maintainers.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styling with CSS
- Payment processing by [Stripe](https://stripe.com)
- Icons and assets from community projects

---


