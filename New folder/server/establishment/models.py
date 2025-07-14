from django.db import models
from base.models import User
from django.utils import timezone

class NatureOfBusiness(models.Model):
    name = models.CharField(max_length=50, unique=True, verbose_name="Business Nature")
    description = models.TextField(blank=True, null=True, verbose_name="Description")
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Nature of Business"
        verbose_name_plural = "Nature of Business Options"
        ordering = ['name']

    def __str__(self):
        return self.name

class Establishment(models.Model):
    name = models.CharField(max_length=255, verbose_name="Establishment Name")
    owner = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='establishments',
        verbose_name="Owner",
        null=True,
        blank=True
    )
    year_established = models.PositiveIntegerField(
        verbose_name="Year Established",
        null=True,
        blank=True
    )
    nature_of_business = models.ForeignKey(
        NatureOfBusiness,
        on_delete=models.SET_NULL,
        related_name='establishments',
        verbose_name="Nature of Business",
        null=True,
        blank=True
    )
    address_line = models.CharField(max_length=255, verbose_name="Street Address")
    barangay = models.CharField(max_length=100, verbose_name="Barangay")
    city = models.CharField(max_length=100, verbose_name="City/Municipality")
    province = models.CharField(max_length=100, verbose_name="Province")
    region = models.CharField(max_length=100, verbose_name="Region")
    postal_code = models.CharField(
        max_length=4, 
        verbose_name="Postal Code",
        blank=True,
        null=True
    )
    latitude = models.DecimalField(
        max_digits=18, 
        decimal_places=15,
        null=True,
        blank=True,
        verbose_name="Latitude"
    )
    longitude = models.DecimalField(
        max_digits=18, 
        decimal_places=15,
        null=True,
        blank=True,
        verbose_name="Longitude"
    )
    is_archived = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Establishment"
        verbose_name_plural = "Establishments"

    def __str__(self):
        return self.name

    @property
    def full_address(self):
        address_parts = [
            self.address_line,
            self.barangay,
            self.city,
            self.province,
            self.region,
            self.postal_code
        ]
        return ", ".join(filter(None, address_parts))

    @property
    def address(self):
        return self.full_address

    @property
    def coordinates(self):
        if self.latitude and self.longitude:
            return f"{self.latitude:.6f}, {self.longitude:.6f}"
        return "No coordinates"

    @property
    def year(self):
        return str(self.year_established) if self.year_established else ""

    @property
    def createdAt(self):
        return self.created_at

class EstablishmentPolygon(models.Model):
    establishment = models.OneToOneField(
        Establishment,
        on_delete=models.CASCADE,
        related_name='polygon',
        verbose_name="Establishment"
    )
    coordinates = models.JSONField(
        verbose_name="Polygon Coordinates",
        help_text="GeoJSON format coordinates for the polygon"
    )
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Establishment Polygon"
        verbose_name_plural = "Establishment Polygons"
        ordering = ['-created_at']

    def __str__(self):
        return f"Polygon for {self.establishment.name}"