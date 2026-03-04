from django.db import models
from django.contrib.auth.models import User

class Producto(models.Model):
    vendedor = models.ForeignKey(User, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    imagen = models.ImageField(upload_to="productos/", blank=True, null=True)
    disponible = models.BooleanField(default=True)
    creado = models.DateTimeField(auto_now_add=True)

    class Meta:
        permissions = [
            ("puede_publicar_producto", "Puede publicar producto"),
        ]

    def __str__(self):
        return self.nombre