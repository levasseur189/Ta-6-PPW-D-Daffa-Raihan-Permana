# 🌤️ Weather Dashboard — Indonesia Cities Weather App

A modern, responsive, and animated **Weather Dashboard** built using  
**HTML + TailwindCSS + JavaScript + OpenWeather API**.  
Aplikasi ini memungkinkan pengguna mencari cuaca **seluruh kota di Indonesia**, menyimpan kota favorit, melihat ramalan cuaca, serta fitur dark mode.

---

## 🚀 Features

### 🌍 **Real-time Weather**
- Cek cuaca saat ini (temperature, humidity, wind speed)
- Mendukung **seluruh kota di Indonesia**
- Menampilkan ikon cuaca dinamis

### 📅 **5-Day Forecast**
- Menampilkan prakiraan cuaca 5 hari
- Ikon cuaca otomatis sesuai kondisi

### ⭐ **Favorite Cities**
- Simpan dan pilih kota favorit
- Sync dengan localStorage

### 🌓 **Dark Mode**
- Tema Dark & Light dengan animasi lembut
- Tersimpan di localStorage

### 📍 **Get Location Weather**
- Cek cuaca berdasarkan lokasi GPS pengguna
- (Bekerja pada HTTPS / localhost)

### 🖼️ **Beautiful UI**
- Glassmorphism UI
- Float animation
- Gradient animated background

---

## 📂 Folder Structure
/project
│── index.html
│── /css
│ └── style.css
│── /js
└── app.js

## ⚙️ How to Run
### **1. Jalankan menggunakan Live Server (VSCode) — Recommended**
1. Install extension **Live Server**
2. Klik kanan `index.html`
3. Pilih **Open With Live Server**

### **2. api Key Set Up** 

Edit di file js/app.js:
var API_KEY = 'YOUR_OPENWEATHER_API_KEY';


1.	Untuk mendapatkan API Key:
2.	Buka https://openweathermap.org/api
3.	Register & login
4.	Pergi ke My API Keys
5.	Copy API Key → tempelkan ke project
