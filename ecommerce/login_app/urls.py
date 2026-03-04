from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.views.generic import RedirectView
from .views import (
    index,
    landing,
    pago,
    register,
    dashboard,
    vista_protegida_permiso,
    DashboardMixinView,
    VistaPermisoMixinView,
)


urlpatterns = [
    # Página principal
    path("", index, name="index"),
    
    path("pago/", pago, name="pago"),    
    
    # Autenticación
    path("login/", auth_views.LoginView.as_view(
        template_name="login.html"
    ), name="login"),

    path("logout/", auth_views.LogoutView.as_view(
        next_page="index"
    ), name="logout"),

    path("register/", register, name="register"),

    # Dashboard
    path("dashboard/", dashboard, name="dashboard"),
    path("permiso/", vista_protegida_permiso, name="vista_permiso"),

    # Vistas con mixins
    path("dashboard-mixin/", DashboardMixinView.as_view(), name="dashboard_mixin"),
    path("permiso-mixin/", VistaPermisoMixinView.as_view(), name="permiso_mixin"),

    # App contacto
    path("contacto/", include("contacto.urls")),

    # Catch-all (SIEMPRE AL FINAL)
    # path("<path:anything>", RedirectView.as_view(url="/", permanent=False)),
]