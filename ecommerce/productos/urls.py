from django.urls import path
from . import views

urlpatterns = [
    path("crear/", views.crear_producto, name="crear_producto"),
    path("mis-productos/", views.mis_productos, name="mis_productos"),
    path("editar/<int:pk>/", views.editar_producto, name="editar_producto"),
    path("eliminar/<int:pk>/", views.eliminar_producto, name="eliminar_producto"),
]