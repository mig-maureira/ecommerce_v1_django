from django import forms

class ContactoForm(forms.Form):
    nombre = forms.CharField(
        label="Nombre",
        max_length=80,
        required=True,
                widget=forms.TextInput(attrs={
            "class": "form-control",
            "placeholder": "Nombre y Apellido"
        })
    )

    correo = forms.EmailField(
        label="Correo electrónico",
        required=True,
        widget=forms.EmailInput(attrs={
            "class": "form-control"
        })
    )

    mensaje = forms.CharField(
        label="Mensaje",
        widget=forms.Textarea(attrs={
            "class": "form-control",
            "placeholder": "Pongamonos en Contacto"}),
        min_length=10,
        required=True
    )

    def clean_nombre(self):
        nombre = self.cleaned_data["nombre"].strip()
        if len(nombre.split()) < 2:
            raise forms.ValidationError("Debe ingresar nombre y apellido.")
        return nombre

    def clean(self):
        cleaned_data = super().clean()
        correo = cleaned_data.get("correo", "")
        if correo.endswith("@mailinator.com"):
            raise forms.ValidationError("No se permiten correos temporales.")
        return cleaned_data