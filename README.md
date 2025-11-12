# Hack SJL - Sistema de Reportes Anónimos y Dashboard Municipal

Sistema completo de reportes anónimos para San Juan de Lurigancho con Dashboard de Mando Centralizado para la municipalidad.

## 🏗️ Arquitectura del Proyecto

Este es un **monorepo** que contiene 3 proyectos separados:

1. **`frontend-pwa/`** - PWA pública para vecinos (100% anónima)
2. **`frontend-dashboard/`** - Dashboard privado para la municipalidad (requiere autenticación)
3. **`backend/`** - API Backend (FastAPI) - El cerebro que conecta ambos frontends

### ⚠️ Separación de Seguridad

- **PWA del Vecino**: Pública, anónima, sin autenticación. Cualquiera puede acceder.
- **Dashboard Municipal**: Privado, protegido con autenticación. Solo operadores autorizados.

**NUNCA** debe existir un link o ruta desde la PWA hacia el Dashboard. Son dos aplicaciones completamente separadas.

## 🚀 Inicio Rápido

### Prerrequisitos

- Docker y Docker Compose instalados
- Node.js 16+ (solo para desarrollo local sin Docker)

### Opción 1: Docker (Recomendado)

```bash
# Clonar el repositorio
git clone <repo-url>
cd hack-sjl

# Levantar todos los servicios
docker-compose up
```

Esto levantará:
- **PWA**: http://localhost:3000
- **Dashboard**: http://localhost:3001
- **Backend API**: http://localhost:8000

### Opción 2: Desarrollo Local

#### PWA (Frontend del Vecino)

```bash
cd frontend-pwa
npm install
npm start
```

Abre http://localhost:3000

#### Dashboard (Frontend Municipal)

```bash
cd frontend-dashboard
npm install
npm start
```

Abre http://localhost:3001

**Credenciales de prueba:**
- Usuario: `admin`
- Contraseña: `admin`

#### Backend API

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

API disponible en http://localhost:8000

## 📁 Estructura del Proyecto

```
hack-sjl/
├── frontend-pwa/          # PWA para vecinos
│   ├── src/
│   │   ├── components/   # Componentes de la PWA
│   │   ├── pages/         # Páginas (solo HomePage)
│   │   ├── services/      # Servicios API (localStorage por ahora)
│   │   └── constants/     # Categorías de reportes
│   └── package.json
│
├── frontend-dashboard/     # Dashboard para municipalidad
│   ├── src/
│   │   ├── components/
│   │   │   └── dashboard/ # Módulos del dashboard
│   │   ├── pages/         # LoginPage, DashboardPage
│   │   ├── services/      # Servicios de análisis
│   │   └── constants/     # Categorías compartidas
│   └── package.json
│
├── backend/                # API Backend
│   ├── main.py            # FastAPI app
│   ├── models/            # Modelos de datos
│   ├── routes/             # Endpoints API
│   └── requirements.txt
│
├── docker-compose.yml      # Orquestación de servicios
└── README.md
```

## 🎯 Funcionalidades

### PWA del Vecino

- ✅ Reportes 100% anónimos (sin nombre, DNI, ni celular)
- ✅ Mapa interactivo de SJL
- ✅ 9 categorías de reportes (Incidentes, Sospechas, Riesgos)
- ✅ Ver reportes cercanos de las últimas 48 horas
- ✅ PWA instalable (funciona offline)

### Dashboard Municipal

#### 1. Monitor de Pulso
- Mapa en tiempo real con reportes
- Sistema de Enjambre de Alertas (detecta 3+ reportes críticos en 200m)
- Alertas sonoras y visuales

#### 2. Planificador Táctico
- Generador de Directivas de Patrullaje
- Análisis por turnos (Mañana, Tarde, Noche)
- Identificación de zonas de riesgo y horas pico
- Tácticas sugeridas para patrullaje

#### 3. Gestor de Riesgos
- Matriz Causa-Efecto
- Correlación entre riesgos (postes sin luz, parques abandonados) e incidentes
- Recomendaciones con impacto cuantificado

## 🔧 Configuración

### Variables de Entorno

#### PWA y Dashboard
Crear archivo `.env` en cada frontend:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
REACT_APP_API_URL=http://localhost:8000
```

#### Backend
Crear archivo `.env` en `backend/`:

```env
DATABASE_URL=sqlite:///./reports.db
SECRET_KEY=tu_secret_key_aqui
```

## 📝 Notas de Desarrollo

- Actualmente la PWA usa `localStorage` para almacenar reportes (simulación)
- El Dashboard lee de la misma fuente (localStorage) para desarrollo
- En producción, ambos deben conectarse al backend real
- El backend debe implementar autenticación JWT para el dashboard

## 🚢 Despliegue

### PWA
- Compilar: `cd frontend-pwa && npm run build`
- Desplegar en cualquier hosting estático (Netlify, Vercel, etc.)
- URL pública: `https://sjlconecta.gob.pe`

### Dashboard
- Compilar: `cd frontend-dashboard && npm run build`
- Desplegar en subdominio privado con autenticación
- URL privada: `https://dashboard.sjlconecta.gob.pe`

### Backend
- Desplegar en servidor con Python 3.9+
- Configurar base de datos PostgreSQL/MySQL
- Configurar variables de entorno de producción

## 📄 Licencia

Este proyecto fue desarrollado para el Hackathon de San Juan de Lurigancho.

