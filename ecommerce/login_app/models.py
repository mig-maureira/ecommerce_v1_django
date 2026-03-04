from django.db import models
from django.contrib.auth.models import User


class Contacto(models.Model):
    nombre = models.CharField(max_length=80)
    correo = models.EmailField()
    mensaje = models.TextField()

    def __str__(self):
        return self.nombre        
        
     
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to="perfiles/", blank=True, null=True)
    # Nuevos campos para el Dashboard
    direccion = models.CharField(max_length=200, blank=True, null=True)
    ciudad = models.CharField(max_length=100, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.user.username        