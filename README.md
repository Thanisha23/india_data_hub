<div align="center">

# IndiaDataHub

### Economic Data Platform for India & Global Datasets

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

---

## 🚀 Performance Optimizations

This application handles **large datasets efficiently** through multiple optimization techniques:

### 📄 Pagination Strategy
- **Only 10 records** rendered at a time instead of thousands

```typescript
const PAGE_SIZE = 10;
const paginatedItems = useMemo(() => {
  const start = (page - 1) * PAGE_SIZE;
  return filteredItems.slice(start, start + PAGE_SIZE);
}, [filteredItems, page]);
```


## 🎯 Features

- 🔍 **Dual Search**: Global navbar search + local catalog filtering
- 🎛️ **Advanced Filters**: Frequency, unit, category with live updates
- 🔖 **User Actions**: Bookmark, cart, pin, multi-select
- 📱 **Responsive**: Mobile-first design with adaptive layouts

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your NEXTAUTH_SECRET and NEXTAUTH_URL

# Run development server
npm run dev
```

**Default Login**: `test@gmail.com` / `123456`

---



<div align="center">

**Built with ❤️ for efficient data exploration**

</div>