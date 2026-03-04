from django.urls import path
from .views import contacto, inicio

urlpatterns = [
    path("", inicio, name="inicio"),
    path("", contacto, name="contacto"),
]