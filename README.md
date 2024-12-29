# Restaurant Database Frontend

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
  - [Table Management](#table-management)
  - [Order Management](#-order-management)
  - [Menu Management](#-menu-management)
  - [Staff Management](#-staff-management)
  - [Payment Processing](#-payment-processing)
  - [Customer Management](#-customer-management)
  - [Inventory Control](#-inventory-control)
  - [Real-time Updates](#-real-time-updates)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)

## Overview

A comprehensive restaurant management system built with EJS, JavaScript, and CSS. This application provides an intuitive interface for managing restaurant operations, orders, and inventory.

## Key Features

### Table Management
- Real-time table status tracking (Available/Occupied)
- Table capacity and location management
- Dynamic table assignment system
- Visual representation of table layout

### 📝 Order Management
- Create and track orders in real-time
- Link orders to specific tables and waiters
- Special requests handling
- Order status tracking (Open, In Progress, Completed, Closed)
- Payment status monitoring (Pending, Completed)

### 👨‍🍳 Menu Management
- Comprehensive menu item management
- Ingredient tracking and inventory
- Menu item pricing
- Category organization

### 🧑‍💼 Staff Management
- Waiter assignment and tracking
- Staff performance monitoring
- Employee scheduling capabilities

### 💰 Payment Processing
- Order total calculation
- Payment status tracking
- Transaction history

### 👥 Customer Management
- Customer profile management
- Order history tracking
- Special preferences recording

### 📊 Inventory Control
- Ingredient stock management
- Low stock alerts
- Usage tracking
- Cost monitoring

### 🔄 Real-time Updates
- Live order status updates
- Table availability tracking
- Kitchen order notifications

## Technology Stack

- Frontend: EJS (54.8%), JavaScript (39.5%), CSS (5.7%)
- Database: MongoDB with Mongoose
- Server: Express.js
- Architecture: MVC Pattern

## Project Structure

The application follows a modular structure with separate routes for:
- Orders management
- Table management
- Menu and ingredient control
- Staff operations
- Customer interactions
