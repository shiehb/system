from django.db import models
from base.models import User
from django.utils import timezone

class Establishment(models.Model):
    # Nature of Business Choices
    NATURE_CHOICES = [
        ('retail', 'Retail'),
        ('food', 'Food & Beverage'),
        ('service', 'Service'),
        ('manufacturing', 'Manufacturing'),
        ('hospitality', 'Hospitality'),
        ('healthcare', 'Healthcare'),
        ('education', 'Education'),
        ('other', 'Other'),
    ]
    
    # Basic Information
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
    nature_of_business = models.CharField(
        max_length=50,
        choices=NATURE_CHOICES,
        blank=True,
        null=True,
        verbose_name="Nature of Business"
    )
    
    # Address Components
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
    
    # Geo Coordinates
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
    
    # Metadata
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
        """Constructs the complete address string for API responses"""
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
        """Alias for full_address to match frontend expectations"""
        return self.full_address

    @property
    def coordinates(self):
        """Formats coordinates for display in API responses"""
        if self.latitude and self.longitude:
            return f"{self.latitude:.6f}, {self.longitude:.6f}"
        return "No coordinates"

    @property
    def year(self):
        """Alias for year_established to match frontend expectations"""
        return str(self.year_established) if self.year_established else ""

    @property
    def createdAt(self):
        """Alias for created_at to match frontend expectations"""
        return self.created_at

    def save(self, *args, **kwargs):
        """Custom save method to handle coordinate parsing if needed"""
        if hasattr(self, '_coordinates'):
            try:
                lat, lon = map(float, self._coordinates.split(','))
                self.latitude = lat
                self.longitude = lon
            except (ValueError, AttributeError):
                pass
        super().save(*args, **kwargs)