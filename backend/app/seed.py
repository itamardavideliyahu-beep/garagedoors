"""Idempotent seed data so the API is demo-ready immediately."""

from sqlalchemy import select

from app.core.db import AsyncSessionLocal
from app.core.security import hash_password
from app.models.review import Review
from app.models.service import Service, ServiceArea, ServiceCategory
from app.models.user import User, UserRole

SERVICES_SEED: list[dict] = [
    {
        "slug": "spring-repair",
        "name_en": "Broken Spring Repair",
        "name_es": "Reparacion de Resorte Roto",
        "description_en": (
            "Same-day torsion and extension spring replacement using high-cycle, "
            "lifetime-warranty springs. Restore your door in under an hour."
        ),
        "description_es": (
            "Reemplazo de resortes de torsion y extension el mismo dia con resortes de "
            "alto ciclo y garantia de por vida. Restaure su puerta en menos de una hora."
        ),
        "category": ServiceCategory.REPAIR,
        "icon": "spring",
        "base_price": 250,
        "starts_at_price": 220,
        "duration_min": 75,
        "is_emergency": True,
        "is_featured": True,
        "sort_order": 10,
    },
    {
        "slug": "opener-repair",
        "name_en": "Garage Door Opener Repair & Install",
        "name_es": "Reparacion e Instalacion de Abridor",
        "description_en": (
            "Diagnose and repair any opener (LiftMaster, Genie, Chamberlain). "
            "Smart Wi-Fi opener upgrades available with MyQ and HomeKit support."
        ),
        "description_es": (
            "Diagnosticamos y reparamos cualquier abridor (LiftMaster, Genie, "
            "Chamberlain). Actualizaciones a abridor inteligente Wi-Fi con MyQ y HomeKit."
        ),
        "category": ServiceCategory.REPAIR,
        "icon": "cpu",
        "base_price": 320,
        "starts_at_price": 180,
        "duration_min": 90,
        "is_emergency": True,
        "is_featured": True,
        "sort_order": 20,
    },
    {
        "slug": "off-track",
        "name_en": "Off-Track Door Repair",
        "name_es": "Reparacion de Puerta Fuera de Riel",
        "description_en": (
            "When your door jumps the track, we realign rollers, hinges and tracks, "
            "and replace any bent components - same day."
        ),
        "description_es": (
            "Cuando la puerta se sale de la riel, realineamos rodillos, bisagras y "
            "rieles, y reemplazamos componentes doblados - el mismo dia."
        ),
        "category": ServiceCategory.REPAIR,
        "icon": "align-left",
        "base_price": 220,
        "starts_at_price": 150,
        "duration_min": 60,
        "is_emergency": True,
        "is_featured": False,
        "sort_order": 30,
    },
    {
        "slug": "panel-replacement",
        "name_en": "Panel Replacement",
        "name_es": "Reemplazo de Panel",
        "description_en": (
            "Replace dented, cracked or rotted panels matching your existing door "
            "color and style. Save the cost of a full replacement."
        ),
        "description_es": (
            "Reemplazamos paneles abollados, agrietados o podridos manteniendo el color "
            "y estilo de su puerta actual. Ahorre el costo de un reemplazo completo."
        ),
        "category": ServiceCategory.REPAIR,
        "icon": "layers",
        "base_price": 560,
        "starts_at_price": 280,
        "duration_min": 120,
        "is_emergency": False,
        "is_featured": False,
        "sort_order": 40,
    },
    {
        "slug": "new-installation",
        "name_en": "New Garage Door Installation",
        "name_es": "Instalacion de Puerta Nueva",
        "description_en": (
            "Beautiful new doors from Clopay, Amarr and Wayne Dalton - steel, aluminum, "
            "wood or glass. Free in-home design consultation."
        ),
        "description_es": (
            "Hermosas puertas nuevas de Clopay, Amarr y Wayne Dalton - acero, aluminio, "
            "madera o vidrio. Consulta de diseno gratis en su casa."
        ),
        "category": ServiceCategory.INSTALLATION,
        "icon": "home",
        "base_price": 1800,
        "starts_at_price": 950,
        "duration_min": 240,
        "is_emergency": False,
        "is_featured": True,
        "sort_order": 50,
    },
    {
        "slug": "tune-up",
        "name_en": "25-Point Maintenance Tune-Up",
        "name_es": "Mantenimiento de 25 Puntos",
        "description_en": (
            "Annual tune-up: lubrication, balance check, hardware tightening, safety "
            "sensor test, opener force calibration and more."
        ),
        "description_es": (
            "Mantenimiento anual: lubricacion, prueba de balance, ajuste de herrajes, "
            "prueba de sensores, calibracion del abridor y mas."
        ),
        "category": ServiceCategory.MAINTENANCE,
        "icon": "clipboard-check",
        "base_price": 119,
        "starts_at_price": 89,
        "duration_min": 45,
        "is_emergency": False,
        "is_featured": True,
        "sort_order": 60,
    },
    {
        "slug": "cable-replacement",
        "name_en": "Cable Replacement",
        "name_es": "Reemplazo de Cable",
        "description_en": (
            "Snapped lift cables can be dangerous. Same-day cable replacement on both "
            "sides with safety inspection of springs and drums."
        ),
        "description_es": (
            "Los cables rotos son peligrosos. Reemplazo el mismo dia en ambos lados "
            "con inspeccion de resortes y tambores."
        ),
        "category": ServiceCategory.REPAIR,
        "icon": "link",
        "base_price": 240,
        "starts_at_price": 180,
        "duration_min": 60,
        "is_emergency": True,
        "is_featured": False,
        "sort_order": 70,
    },
    {
        "slug": "emergency-service",
        "name_en": "24/7 Emergency Service",
        "name_es": "Servicio de Emergencia 24/7",
        "description_en": (
            "Stuck door at 2am? Car trapped inside? We dispatch nights, weekends and "
            "holidays. Technician on-site within 60 minutes anywhere in LA."
        ),
        "description_es": (
            "Puerta atascada a las 2am? Carro atrapado? Despachamos noches, fines de "
            "semana y feriados. Tecnico en sitio en menos de 60 minutos."
        ),
        "category": ServiceCategory.EMERGENCY,
        "icon": "siren",
        "base_price": 199,
        "starts_at_price": 149,
        "duration_min": 60,
        "is_emergency": True,
        "is_featured": True,
        "sort_order": 5,
    },
    {
        "slug": "commercial",
        "name_en": "Commercial Garage Doors",
        "name_es": "Puertas Comerciales",
        "description_en": (
            "Rolling steel doors, sectional commercial, high-speed and loading dock "
            "equipment for warehouses, auto shops and retail."
        ),
        "description_es": (
            "Puertas enrollables de acero, seccionales comerciales, alta velocidad y "
            "equipos de muelle de carga para almacenes, talleres y comercios."
        ),
        "category": ServiceCategory.COMMERCIAL,
        "icon": "building",
        "base_price": 450,
        "starts_at_price": 250,
        "duration_min": 120,
        "is_emergency": True,
        "is_featured": False,
        "sort_order": 80,
    },
]


SERVICE_AREAS_SEED: list[dict] = [
    {
        "slug": "westside",
        "name": "Westside (Santa Monica, Venice, Brentwood, Beverly Hills)",
        "zip_codes": [
            "90401", "90402", "90403", "90404", "90405",
            "90291", "90292",
            "90049", "90024", "90064", "90025",
            "90210", "90211", "90212",
        ],
        "geojson": {
            "type": "Polygon",
            "coordinates": [[
                [-118.52, 34.04], [-118.52, 34.10], [-118.39, 34.10],
                [-118.36, 34.07], [-118.39, 34.01], [-118.52, 34.04],
            ]],
        },
        "response_time_min": 45,
    },
    {
        "slug": "san-fernando-valley",
        "name": "San Fernando Valley (Sherman Oaks, Encino, Van Nuys, Burbank)",
        "zip_codes": [
            "91423", "91403", "91436",
            "91316", "91436", "91364",
            "91401", "91405", "91406", "91411",
            "91501", "91502", "91504", "91505", "91506",
        ],
        "geojson": {
            "type": "Polygon",
            "coordinates": [[
                [-118.55, 34.15], [-118.55, 34.25], [-118.27, 34.25],
                [-118.27, 34.15], [-118.55, 34.15],
            ]],
        },
        "response_time_min": 55,
    },
    {
        "slug": "downtown-la",
        "name": "Downtown LA & Mid-City",
        "zip_codes": [
            "90012", "90013", "90014", "90015", "90017", "90021",
            "90006", "90007", "90019", "90035", "90036",
        ],
        "geojson": {
            "type": "Polygon",
            "coordinates": [[
                [-118.30, 34.02], [-118.30, 34.09], [-118.20, 34.09],
                [-118.20, 34.02], [-118.30, 34.02],
            ]],
        },
        "response_time_min": 50,
    },
    {
        "slug": "south-bay",
        "name": "South Bay (Long Beach, Torrance, Manhattan Beach, Redondo)",
        "zip_codes": [
            "90802", "90803", "90804", "90805", "90806", "90807", "90808",
            "90501", "90502", "90503", "90504", "90505",
            "90266", "90277", "90278",
        ],
        "geojson": {
            "type": "Polygon",
            "coordinates": [[
                [-118.42, 33.74], [-118.42, 33.88], [-118.13, 33.88],
                [-118.13, 33.74], [-118.42, 33.74],
            ]],
        },
        "response_time_min": 60,
    },
    {
        "slug": "san-gabriel-valley",
        "name": "San Gabriel Valley (Pasadena, Glendale, Alhambra)",
        "zip_codes": [
            "91101", "91103", "91104", "91105", "91106", "91107",
            "91201", "91202", "91203", "91204", "91205", "91206", "91207",
            "91801", "91802", "91803",
        ],
        "geojson": {
            "type": "Polygon",
            "coordinates": [[
                [-118.30, 34.10], [-118.30, 34.22], [-118.04, 34.22],
                [-118.04, 34.10], [-118.30, 34.10],
            ]],
        },
        "response_time_min": 55,
    },
]


REVIEWS_SEED: list[dict] = [
    {
        "customer_name": "Maria G.",
        "customer_location": "Santa Monica, CA",
        "rating": 5,
        "title": "Saved my morning!",
        "comment": (
            "Spring broke at 7am, car trapped inside. Called and a technician was here "
            "in 40 minutes. Honest pricing, fixed in under an hour. Highly recommend!"
        ),
        "service_type": "Spring repair",
        "is_featured": True,
        "is_published": True,
        "source": "Google",
    },
    {
        "customer_name": "David K.",
        "customer_location": "Sherman Oaks, CA",
        "rating": 5,
        "title": "Professional and fast",
        "comment": (
            "Installed a new LiftMaster Wi-Fi opener with HomeKit. The tech explained "
            "everything in plain English and the price was exactly what was quoted online."
        ),
        "service_type": "Opener install",
        "is_featured": True,
        "is_published": True,
        "source": "Yelp",
    },
    {
        "customer_name": "Jennifer L.",
        "customer_location": "Pasadena, CA",
        "rating": 5,
        "title": "Hablan espanol - excellent service",
        "comment": (
            "El tecnico fue muy amable y profesional. Reparo la puerta el mismo dia y "
            "el precio fue justo. Muy recomendado para la familia hispana."
        ),
        "service_type": "Off-track repair",
        "is_featured": True,
        "is_published": True,
        "source": "Google",
    },
    {
        "customer_name": "Robert M.",
        "customer_location": "Long Beach, CA",
        "rating": 5,
        "title": "Best price in LA",
        "comment": (
            "Got 3 quotes - these guys were $200 less than the big-name competitor for "
            "the same job. New panel looks perfect. Will use again."
        ),
        "service_type": "Panel replacement",
        "is_featured": True,
        "is_published": True,
        "source": "Google",
    },
    {
        "customer_name": "Aisha W.",
        "customer_location": "Beverly Hills, CA",
        "rating": 5,
        "title": "Beautiful new wood door",
        "comment": (
            "Custom wood door installed last week. Crew was on time, clean, and the "
            "finished work is gorgeous. Got compliments from the neighbors already."
        ),
        "service_type": "New installation",
        "is_featured": True,
        "is_published": True,
        "source": "Website",
    },
    {
        "customer_name": "Carlos R.",
        "customer_location": "Downtown LA",
        "rating": 5,
        "title": "Emergency at midnight",
        "comment": (
            "Roll-up door at my body shop got stuck at midnight. Technician was here in "
            "55 minutes, had the part on the truck, problem solved. Lifesaver."
        ),
        "service_type": "Commercial / Emergency",
        "is_featured": False,
        "is_published": True,
        "source": "Google",
    },
]


ADMIN_SEED = {
    "email": "admin@lagaragedoorspro.com",
    "password": "ChangeMe123!",
    "full_name": "Site Administrator",
    "role": UserRole.ADMIN,
}


async def seed_initial_data() -> None:
    """Idempotently insert seed data if tables are empty."""

    async with AsyncSessionLocal() as db:
        existing_services = (await db.execute(select(Service.id).limit(1))).scalar_one_or_none()
        if existing_services is None:
            for row in SERVICES_SEED:
                db.add(Service(**row))

        existing_areas = (await db.execute(select(ServiceArea.id).limit(1))).scalar_one_or_none()
        if existing_areas is None:
            for row in SERVICE_AREAS_SEED:
                db.add(ServiceArea(**row))

        existing_reviews = (await db.execute(select(Review.id).limit(1))).scalar_one_or_none()
        if existing_reviews is None:
            for row in REVIEWS_SEED:
                db.add(Review(**row))

        existing_admin = (
            await db.execute(select(User).where(User.email == ADMIN_SEED["email"]))
        ).scalar_one_or_none()
        if not existing_admin:
            db.add(
                User(
                    email=ADMIN_SEED["email"],
                    hashed_password=hash_password(ADMIN_SEED["password"]),
                    full_name=ADMIN_SEED["full_name"],
                    role=ADMIN_SEED["role"],
                    is_active=True,
                    is_verified=True,
                )
            )

        await db.commit()
