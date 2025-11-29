var API_KEY = 'eb5800dd3d3010039c45337f71ef41fc';

var state = {
    currentWeather: null,
    forecast: [],
    city: 'Jakarta',
    favorites: ['Jakarta', 'Bandung', 'Surabaya'],
    isCelsius: true,
    isDark: false,
    lastUpdate: null
};

var popularCities = [
    'Jakarta','Bandung','Surabaya','Medan','Semarang','Makassar','Palembang',
    'Tangerang','Depok','Bekasi','Yogyakarta','Malang','Bogor','Padang'
];

// ======================================================
// ICONS
// ======================================================
function getWeatherIcon(condition, size) {
    var sizeClass = size === 'large' ? 'w-24 h-24' :
                    size === 'medium' ? 'w-16 h-16' : 'w-12 h-12';

    var main = (condition || '').toLowerCase();

    if (main.includes('rain'))
        return `<svg class="${sizeClass} text-blue-400 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 17a4 4 0 014-4h10a4 4 0 110 8H7a4 4 0 01-4-4zm14-6a3 3 0 00-3-3 3 3 0 00-3 3m-6 6l-1 1m-2-2l-1 1m4-4l-1 1"/>
                </svg>`;

    if (main.includes('snow'))
        return `<svg class="${sizeClass} text-blue-200 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-width="2" d="M3 17a4 4 0 014-4h10a4 4 0 110 8H7a4 4 0 01-4-4z"/>
                </svg>`;

    if (main.includes('cloud'))
        return `<svg class="${sizeClass} text-gray-300 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-width="2"
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
                </svg>`;

    if (main.includes('clear'))
        return `<svg class="${sizeClass} text-yellow-400 drop-shadow-lg animate-spin-slow" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5"/>
                    <path stroke-width="2" stroke-linecap="round"
                        d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
                </svg>`;

    return `<svg class="${sizeClass} text-gray-300 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-width="2"
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
            </svg>`;
}

function convertTemp(temp) {
    return state.isCelsius ? Math.round(temp) : Math.round((temp * 9/5) + 32);
}

// ======================================================
// FETCH WEATHER DATA
// ======================================================
function fetchWeather(cityName) {
    showLoading(true);

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`)
        .then(r => r.json())
        .then(data => {
            if (data.cod === 200) {
                state.currentWeather = data;
                state.city = cityName;
                state.lastUpdate = new Date();
                return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`);
            }
        })
        .then(r => r.json())
        .then(data => {
            state.forecast = data.list.filter(item =>
                item.dt_txt.includes("12:00:00")
            ).slice(0, 5);

            renderWeather();
            showLoading(false);
        })
        .catch(err => {
            console.error("Error:", err);
            showLoading(false);
        });
}

function fetchWeatherByCoord(lat, lon, cityName) {
    showLoading(true);

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
        .then(r => r.json())
        .then(data => {
            state.currentWeather = data;
            state.city = cityName || data.name;
            state.lastUpdate = new Date();
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        })
        .then(r => r.json())
        .then(data => {
            state.forecast = data.list.filter(item =>
                item.dt_txt.includes("12:00:00")
            ).slice(0, 5);

            renderWeather();
            showLoading(false);
        })
        .catch(err => {
            console.log("City Fetch Error:", err);
            showLoading(false);
        });
}

// ======================================================
// UI HANDLERS
// ======================================================
function showLoading(b) {
    document.getElementById("loading").classList.toggle("hidden", !b);
    if (b) {
        document.getElementById("currentWeather").classList.add("hidden");
        document.getElementById("forecastContainer").classList.add("hidden");
    }
}

// ======================================================
// RENDER CURRENT WEATHER
// ======================================================
function renderWeather() {
    if (!state.currentWeather) return;

    var current = document.getElementById("currentWeather");
    current.classList.remove("hidden");

    var isFavorite = state.favorites.includes(state.city);
    var textColor = state.isDark ? "text-white" : "text-gray-800";

    current.innerHTML = `
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-8">
            <div class="flex-1">
                <div class="flex items-center gap-3 mb-3">
                    <h2 class="text-5xl font-bold ${textColor}">
                        ${state.currentWeather.name}, ${state.currentWeather.sys.country}
                    </h2>

                    <button onclick="toggleFavorite()" class="btn-hover hover:scale-125">
                        <svg class="w-8 h-8 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}"
                            fill="${isFavorite ? 'currentColor' : 'none'}" stroke="currentColor">
                            <path stroke-width="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                    </button>
                </div>

                <p class="text-lg opacity-70 flex items-center gap-2 ${textColor}">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor">
                        <path stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    ${state.lastUpdate.toLocaleString()}
                </p>
            </div>

            <div class="animate-float">${getWeatherIcon(state.currentWeather.weather[0].main, 'large')}</div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

            <!-- Current Temp -->
            <div class="glass-effect rounded-3xl p-8 text-center">
                <div class="text-7xl font-bold bg-gradient-to-br from-blue-400 to-purple-500 bg-clip-text text-transparent mb-3">
                    ${convertTemp(state.currentWeather.main.temp)}°
                </div>
                <div class="text-2xl font-semibold capitalize mb-2 ${textColor}">
                    ${state.currentWeather.weather[0].description}
                </div>
                <div class="text-sm opacity-70 ${textColor}">
                    Feels like ${convertTemp(state.currentWeather.main.feels_like)}°
                </div>
            </div>

            <!-- Humidity & Wind -->
            <div class="glass-effect rounded-3xl p-8 space-y-4">
                <div class="flex items-center gap-4 text-lg ${textColor}">
                    <div class="bg-gradient-to-r from-blue-400 to-blue-600 p-3 rounded-2xl">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor">
                            <path stroke-width="2"
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                        </svg>
                    </div>
                    <div>
                        <div class="font-bold">Humidity</div>
                        <div class="opacity-70">${state.currentWeather.main.humidity}%</div>
                    </div>
                </div>

                <div class="flex items-center gap-4 text-lg ${textColor}">
                    <div class="bg-gradient-to-r from-green-400 to-green-600 p-3 rounded-2xl">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor">
                            <path stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                        </svg>
                    </div>
                    <div>
                        <div class="font-bold">Wind Speed</div>
                        <div class="opacity-70">${state.currentWeather.wind.speed} m/s</div>
                    </div>
                </div>
            </div>

            <!-- More Weather -->
            <div class="glass-effect rounded-3xl p-8 space-y-4 ${textColor}">
                <div class="flex justify-between text-lg">
                    <span class="font-semibold">Min Temp</span>
                    <span class="text-2xl font-bold text-blue-400">${convertTemp(state.currentWeather.main.temp_min)}°</span>
                </div>

                <div class="flex justify-between text-lg">
                    <span class="font-semibold">Max Temp</span>
                    <span class="text-2xl font-bold text-red-400">${convertTemp(state.currentWeather.main.temp_max)}°</span>
                </div>

                <div class="flex justify-between text-lg">
                    <span class="font-semibold">Pressure</span>
                    <span class="font-bold">${state.currentWeather.main.pressure} hPa</span>
                </div>
            </div>
        </div>
    `;

    renderForecast();
}

// ======================================================
// RENDER FORECAST
// ======================================================
function renderForecast() {
    var container = document.getElementById("forecastContainer");
    var forecast = document.getElementById("forecast");

    container.classList.remove("hidden");

    var textColor = state.isDark ? "text-white" : "text-gray-800";

    forecast.innerHTML = state.forecast.map(day => {
        var date = new Date(day.dt * 1000);

        return `
            <div class="glass-effect rounded-3xl p-6 weather-card shadow-xl">
                <div class="text-center">
                    <div class="text-xl font-bold mb-2 ${textColor}">
                        ${date.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>

                    <div class="text-sm opacity-70 mb-4 ${textColor}">
                        ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>

                    <div class="flex justify-center mb-4">
                        ${getWeatherIcon(day.weather[0].main, "medium")}
                    </div>

                    <div class="text-xs capitalize mb-4 h-10 flex items-center justify-center ${textColor}">
                        ${day.weather[0].description}
                    </div>

                    <div class="flex justify-center gap-3 text-lg mb-3">
                        <span class="font-bold text-red-400">${convertTemp(day.main.temp_max)}°</span>
                        <span class="opacity-50 ${textColor}">/</span>
                        <span class="font-bold text-blue-400">${convertTemp(day.main.temp_min)}°</span>
                    </div>

                    <div class="flex items-center justify-center gap-2 text-sm opacity-70 bg-white bg-opacity-10 rounded-full py-2 px-4 ${textColor}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor">
                            <path stroke-width="2"
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                        </svg>
                        ${day.main.humidity}%
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

// ======================================================
// FAVORITES
// ======================================================
function renderFavorites() {
    document.getElementById("favorites").innerHTML = state.favorites.map(fav => `
        <button onclick="fetchWeather('${fav}')"
            class="btn-hover px-6 py-3 rounded-2xl font-semibold text-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-110 transition-all">
            ${fav}
        </button>
    `).join("");
}

function toggleFavorite() {
    var idx = state.favorites.indexOf(state.city);
    if (idx !== -1) state.favorites.splice(idx, 1);
    else state.favorites.push(state.city);

    renderFavorites();
    renderWeather();
}

// ======================================================
// SEARCH
// ======================================================
function selectCity(city) {
    document.getElementById("searchInput").value = "";
    document.getElementById("suggestions").classList.add("hidden");
    fetchWeather(city);
}

function handleSearch(event) {
    var value = event.target.value;
    var div = document.getElementById("suggestions");

    if (value.length < 2) {
        div.classList.add("hidden");
        return;
    }

    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${value},ID&limit=5&appid=${API_KEY}`)
        .then(r => r.json())
        .then(data => {
            if (data.length > 0) {
                div.classList.remove("hidden");
                div.innerHTML = data.map(city => `
                    <div onclick="selectCityFromAPI('${city.name}', ${city.lat}, ${city.lon})"
                        class="glass-effect rounded-2xl p-4 mb-2 cursor-pointer hover:scale-105 transition-all shadow-lg font-medium text-gray-800">
                        ${city.name}, ${city.state || ""} (${city.country})
                    </div>
                `).join("");
            } else {
                div.classList.add("hidden");
            }
        });

    if (event.key === "Enter" && value) {
        selectCity(value);
    }
}

function selectCityFromAPI(name, lat, lon) {
    document.getElementById("searchInput").value = "";
    document.getElementById("suggestions").classList.add("hidden");
    fetchWeatherByCoord(lat, lon, name);
}

// ======================================================
// UNIT + THEME
// ======================================================
function toggleUnit() {
    state.isCelsius = !state.isCelsius;
    document.getElementById("unitBtn").textContent = state.isCelsius ? "°C" : "°F";

    if (state.currentWeather) renderWeather();
}

function toggleTheme() {
    state.isDark = !state.isDark;
    var body = document.getElementById("body");

    if (state.isDark) {
        body.className = "min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white transition-all duration-700";
        document.getElementById("themeBtn").innerHTML = `
            <svg class="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5"/>
                <path stroke-width="2" d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
            </svg>`;
        document.getElementById("searchInput").className =
            "flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-lg font-medium";
    } else {
        body.className = "min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-gradient transition-all duration-700";
        document.getElementById("themeBtn").innerHTML = `
            <svg class="w-8 h-8" fill="none" stroke="currentColor">
                <path stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>`;
        document.getElementById("searchInput").className =
            "flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-600 text-lg font-medium";
    }

    if (state.currentWeather) renderWeather();
}

// ======================================================
// REFRESH CURRENT CITY
// ======================================================
function refreshWeather() {
    fetchWeather(state.city);
}

// ======================================================
// GPS WEATHER
// ======================================================
function getMyLocation() {
    if (!navigator.geolocation) {
        alert("Browser kamu tidak mendukung GPS!");
        return;
    }

    showLoading(true);

    navigator.geolocation.getCurrentPosition(
        function(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
                .then(r => r.json())
                .then(data => {
                    if (data.cod === 200) {
                        state.currentWeather = data;
                        state.city = data.name;
                        state.lastUpdate = new Date();

                        return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
                    }
                })
                .then(r => r.json())
                .then(data => {
                    state.forecast = data.list.filter(item =>
                        item.dt_txt.includes("12:00:00")
                    ).slice(0, 5);

                    renderWeather();
                    showLoading(false);
                })
                .catch(err => {
                    alert("Gagal mendapatkan cuaca lokasi Anda.");
                    showLoading(false);
                });
        },
        function(error) {
            showLoading(false);
            alert("Izin lokasi ditolak atau terjadi error!");
        }
    );
}

// ======================================================
// INIT
// ======================================================
renderFavorites();
fetchWeather(state.city);

// auto refresh every 5 minutes
setInterval(() => {
    fetchWeather(state.city);
}, 300000);
