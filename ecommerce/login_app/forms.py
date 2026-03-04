
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Profile  # IMPORTANTE

class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)
    imagen = forms.ImageField(required=False)

    class Meta:
        model = User
        fields = ["username", "email", "password1", "password2", "imagen"]

    def save(self, commit=True):
        user = super().save(commit)
        user.email = self.cleaned_data["email"]
        user.save()

        # Crear perfil con imagen
        Profile.objects.create(
            user=user,
            imagen=self.cleaned_data.get("imagen")
        )

        return user

class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name']
        widgets = {
            'first_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Tu nombre'}),
            'last_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Tu apellido'}),
        }

class ProfileUpdateForm(forms.ModelForm):
    # Opciones para la ciudad según tu HTML
    CIUDADES = [('Santiago', 'Santiago'), ('Valparaíso', 'Valparaíso'), ('Concepción', 'Concepción')]
    
    class Meta:
        model = Profile
        fields = ['imagen', 'direccion', 'ciudad', 'telefono']
        widgets = {
            'imagen': forms.FileInput(attrs={'class': 'form-control'}),
            'direccion': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Calle, número, depto'}),
            'ciudad': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Santiago, Viña del Mar, Concepcion'}),
            'telefono': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '987654321'}),
        }