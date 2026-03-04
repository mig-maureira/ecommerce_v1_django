from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.views.generic import TemplateView
from contacto.forms import ContactoForm
from django.shortcuts import render
from contacto.models import Contacto 
from .forms import RegisterForm, UserUpdateForm, ProfileUpdateForm
from .models import Profile
from productos.views import Producto

def landing(request):
    return render(request, "landing.html")
    
def pago(request):
    return render(request, "pago.html")

def index(request):
    productos = Producto.objects.filter(disponible=True)
    return render(request, "index.html", {
        "productos": productos
    })
    
def register(request):
    if request.method == "POST":
        form = RegisterForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect("dashboard")
    else:
        form = RegisterForm()

    return render(request, "register.html", {"form": form})
# En login_app/views.py




# 1. Asegúrate de importar el modelo de Contacto arriba de todo
from contacto.models import Contacto 
from contacto.forms import ContactoForm
from django.shortcuts import render, redirect
# ... tus otros imports ...
@login_required
def dashboard(request):
    # Intentamos obtener el perfil, o lo creamos si por algún motivo no existe
    perfil, created = Profile.objects.get_or_create(user=request.user)

    if request.method == "POST":
        # Le pasamos instance para que actualice los datos existentes y request.FILES para la imagen
        u_form = UserUpdateForm(request.POST, instance=request.user)
        p_form = ProfileUpdateForm(request.POST, request.FILES, instance=perfil)
        
        if u_form.is_valid() and p_form.is_valid():
            u_form.save()
            p_form.save()
            # Redirigimos para evitar el reenvío de formulario al recargar
            return redirect('dashboard')
    else:
        # Si es GET, cargamos los formularios con la información actual del usuario
        u_form = UserUpdateForm(instance=request.user)
        p_form = ProfileUpdateForm(instance=perfil)
        
    # Enviamos los formularios al template
    return render(request, "dashboard.html", {
        "u_form": u_form,
        "p_form": p_form,
    })
    
@permission_required("auth.view_user", raise_exception=True)
def vista_protegida_permiso(request):
    return HttpResponse("Acceso permitido por permiso")

class DashboardMixinView(LoginRequiredMixin, TemplateView):
    template_name = "dashboard.html"

class VistaPermisoMixinView(PermissionRequiredMixin, TemplateView):
    permission_required = "auth.view_user"
    template_name = "permiso.html"

def landing(request):
    form_contacto = ContactoForm()
    modal = None  
    data = None   

    if request.method == "POST":
        if "contacto_submit" in request.POST:
            form_contacto = ContactoForm(request.POST)
            
            if form_contacto.is_valid():
                # Obtenemos los datos limpios
                data = form_contacto.cleaned_data
                
                # Guardamos usando el modelo de Contacto
                Contacto.objects.create(
                    nombre=data["nombre"],
                    correo=data["correo"],
                    mensaje=data["mensaje"]
                )
                
                # Activamos la señal para abrir el modal de éxito en el HTML
                modal = "contacto_ok"

    # Enviamos el formulario y las variables al landing.html
    return render(request, "landing.html", {
        "form_contacto": form_contacto,
        "modal": modal,
        "data": data
    })
    
