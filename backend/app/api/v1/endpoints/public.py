"""Misc public endpoints: FAQ, gallery, brands, stats."""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class FAQItem(BaseModel):
    question_en: str
    question_es: str
    answer_en: str
    answer_es: str


class GalleryItem(BaseModel):
    id: int
    title_en: str
    title_es: str
    before_image: str
    after_image: str
    service_type: str


class Brand(BaseModel):
    name: str
    logo_url: str


class StatsResponse(BaseModel):
    happy_customers: int
    years_experience: int
    technicians: int
    avg_response_min: int
    rating: float


FAQS: list[FAQItem] = [
    FAQItem(
        question_en="How fast can you arrive in Los Angeles?",
        question_es="Que tan rapido pueden llegar en Los Angeles?",
        answer_en=(
            "For emergency calls we promise a technician at your door within 60 minutes "
            "anywhere in our LA service area (Westside, San Fernando Valley, Downtown, "
            "South Bay, San Gabriel Valley)."
        ),
        answer_es=(
            "Para llamadas de emergencia, le prometemos un tecnico en su puerta en menos "
            "de 60 minutos en toda nuestra area de servicio de LA (Westside, San Fernando "
            "Valley, Downtown, South Bay, San Gabriel Valley)."
        ),
    ),
    FAQItem(
        question_en="Are you licensed, bonded and insured?",
        question_es="Estan licenciados, afianzados y asegurados?",
        answer_en=(
            "Yes - we are fully licensed by the California State License Board (CSLB), "
            "bonded, and carry $2M general liability insurance for your protection."
        ),
        answer_es=(
            "Si - estamos completamente licenciados por la Junta Estatal de Licencias "
            "de California (CSLB), afianzados y tenemos seguro de responsabilidad civil "
            "general de $2M para su proteccion."
        ),
    ),
    FAQItem(
        question_en="Do you charge a service call fee?",
        question_es="Cobran tarifa por la visita?",
        answer_en=(
            "No - our diagnostic visit is 100% free when you approve the repair. "
            "No hidden fees, no surprises. You see the price before we start any work."
        ),
        answer_es=(
            "No - nuestra visita de diagnostico es 100% gratuita cuando aprueba la "
            "reparacion. Sin cargos ocultos, sin sorpresas. Usted ve el precio antes de "
            "que comencemos cualquier trabajo."
        ),
    ),
    FAQItem(
        question_en="What warranty do you offer?",
        question_es="Que garantia ofrecen?",
        answer_en=(
            "Lifetime warranty on springs, 10 years on openers, and 5 years on labor. "
            "If a part we installed fails, we replace it at no cost to you."
        ),
        answer_es=(
            "Garantia de por vida en resortes, 10 anos en abridores y 5 anos en mano de "
            "obra. Si una pieza que instalamos falla, la reemplazamos sin costo para usted."
        ),
    ),
    FAQItem(
        question_en="Do you work on commercial garage doors?",
        question_es="Trabajan en puertas de garaje comerciales?",
        answer_en=(
            "Absolutely. We service rolling steel doors, sectional commercial doors, "
            "high-speed doors and loading dock equipment for warehouses, body shops, "
            "and retail across LA County."
        ),
        answer_es=(
            "Absolutamente. Reparamos puertas enrollables de acero, puertas seccionales "
            "comerciales, puertas de alta velocidad y equipos de muelle de carga para "
            "almacenes, talleres y comercios en todo el condado de LA."
        ),
    ),
    FAQItem(
        question_en="Do you finance larger jobs like new door installations?",
        question_es="Financian trabajos mas grandes como instalaciones nuevas?",
        answer_en=(
            "Yes. We offer 0% APR financing for 12 months on approved credit for "
            "installations over $1,500. Ask your technician for details."
        ),
        answer_es=(
            "Si. Ofrecemos financiamiento 0% APR por 12 meses sobre credito aprobado "
            "para instalaciones de mas de $1,500. Pregunte a su tecnico por los detalles."
        ),
    ),
]


GALLERY: list[GalleryItem] = [
    GalleryItem(
        id=1,
        title_en="Broken spring replaced - Santa Monica",
        title_es="Resorte roto reemplazado - Santa Monica",
        before_image="/gallery/broken-spring-before.jpg",
        after_image="/gallery/broken-spring-after.jpg",
        service_type="spring_broken",
    ),
    GalleryItem(
        id=2,
        title_en="New custom wood door - Beverly Hills",
        title_es="Nueva puerta de madera personalizada - Beverly Hills",
        before_image="/gallery/wood-door-before.jpg",
        after_image="/gallery/wood-door-after.jpg",
        service_type="new_install",
    ),
    GalleryItem(
        id=3,
        title_en="Smart opener upgrade - Sherman Oaks",
        title_es="Actualizacion de abridor inteligente - Sherman Oaks",
        before_image="/gallery/opener-before.jpg",
        after_image="/gallery/opener-after.jpg",
        service_type="opener_failure",
    ),
    GalleryItem(
        id=4,
        title_en="Dented panel restored - Long Beach",
        title_es="Panel abollado restaurado - Long Beach",
        before_image="/gallery/panel-before.jpg",
        after_image="/gallery/panel-after.jpg",
        service_type="panel_damage",
    ),
    GalleryItem(
        id=5,
        title_en="Off-track door realigned - Pasadena",
        title_es="Puerta fuera de riel realineada - Pasadena",
        before_image="/gallery/off-track-before.jpg",
        after_image="/gallery/off-track-after.jpg",
        service_type="off_track",
    ),
    GalleryItem(
        id=6,
        title_en="Commercial roll-up - Downtown LA",
        title_es="Persiana comercial - Downtown LA",
        before_image="/gallery/commercial-before.jpg",
        after_image="/gallery/commercial-after.jpg",
        service_type="new_install",
    ),
]


BRANDS: list[Brand] = [
    Brand(name="LiftMaster", logo_url="/brands/liftmaster.svg"),
    Brand(name="Genie", logo_url="/brands/genie.svg"),
    Brand(name="Chamberlain", logo_url="/brands/chamberlain.svg"),
    Brand(name="Clopay", logo_url="/brands/clopay.svg"),
    Brand(name="Wayne Dalton", logo_url="/brands/wayne-dalton.svg"),
    Brand(name="Amarr", logo_url="/brands/amarr.svg"),
    Brand(name="Linear", logo_url="/brands/linear.svg"),
    Brand(name="Marantec", logo_url="/brands/marantec.svg"),
]


@router.get("/faqs", response_model=list[FAQItem])
async def list_faqs() -> list[FAQItem]:
    return FAQS


@router.get("/gallery", response_model=list[GalleryItem])
async def list_gallery() -> list[GalleryItem]:
    return GALLERY


@router.get("/brands", response_model=list[Brand])
async def list_brands() -> list[Brand]:
    return BRANDS


@router.get("/stats", response_model=StatsResponse)
async def stats() -> StatsResponse:
    return StatsResponse(
        happy_customers=12500,
        years_experience=15,
        technicians=24,
        avg_response_min=38,
        rating=4.9,
    )
