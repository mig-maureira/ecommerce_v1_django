from django.shortcuts import render, redirect
from .forms import  ContactoForm
from .models import Contacto

def contacto(request):
    if request.method == "POST":
        form = ContactoForm(request.POST)
        if form.is_valid():
            data = form.cleaned_data

            Contacto.objects.create(
                nombre=data["nombre"],
                correo=data["correo"],
                mensaje=data["mensaje"],
            )

            return render(request, "dashboard.html", {"data": data})
    else:
        form = ContactoForm()

    return render(request, "landing.html", {"form": form})

def inicio(request):
    # Crear formularios vacíos para cuando la página se carga por primera vez
    form_contacto = ContactoForm()

    # Variable para saber qué modal mostrar en el template
    modal = None

    # Variable para guardar los datos enviados por el usuario
    data = None

    # Verificar si el usuario envió un formulario
    if request.method == "POST":

        # -------- FORMULARIO CONTACTO --------
        # Revisar si el botón del formulario contacto fue presionado
        if "contacto_submit" in request.POST:

            # Cargar datos enviados en el formulario contacto
            form_contacto = ContactoForm(request.POST)

            # Validar datos
            if form_contacto.is_valid():

                # Obtener datos limpios
                data = form_contacto.cleaned_data

                # Guardar en base de datos
                Contacto.objects.create(**data)

                # Indicar al template que muestre el modal de contacto exitoso
                modal = "contacto_ok"

    # Renderizar la página index.html enviando variables al template
    return render(request, "dashboard.html", {

        "form_contacto": form_contacto,  # Para mostrar formulario contacto
        "modal": modal,                  # Para saber qué modal mostrar
        "data": data,                    # Para mostrar datos ingresados
    })