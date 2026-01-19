# Expense Tracker

Expense Tracker is a Laravel + Inertia.js (React) Starter template. The stack uses Vite for bundling and Tailwind CSS for styling.

## Tech Stack

- Backend: Laravel 12, PHP 8.2+
- Frontend: Inertia.js, React 18, Vite 5
- Styling/UI: Tailwind CSS, Headless UI, Lucide icons
- Auth: Laravel Breeze, Sanctum
- Tooling: Ziggy, Axios

## Requirements

- PHP 8.2+
- Composer
- Node.js + npm
- A database (MySQL/PostgreSQL/SQLite)

## Installation

1) Install backend dependencies

```
composer install
```

2) Create environment file and app key

```
cp .env.example .env
php artisan key:generate
```

3) Configure your database in `.env`, then run migrations

```
php artisan migrate
```

4) Install frontend dependencies and build assets

```
npm install
npm run build
```

## Development

Start the backend + frontend dev servers:

```
npm run dev
```

If you prefer, you can run Laravel separately:

```
php artisan serve
```

## Tests

```
composer test
```

## Useful Composer Scripts

- `composer setup` — install deps, create `.env`, key, migrate, build assets
- `composer dev` — run app server, queue, logs, and Vite
- `composer test` — run test suite