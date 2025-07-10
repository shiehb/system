# Optional: Custom middleware to handle HTTP/HTTPS logic
import logging

from django.conf import settings
from django.http import HttpResponsePermanentRedirect
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger(__name__)

class ConditionalHTTPSMiddleware(MiddlewareMixin):
    """
    Custom middleware to conditionally enforce HTTPS based on environment
    """
    def process_request(self, request):
        # Debug logging
        logger.debug(f"Request scheme: {request.scheme}")
        logger.debug(f"Is secure: {request.is_secure()}")
        logger.debug(f"X-Forwarded-Proto: {request.META.get('HTTP_X_FORWARDED_PROTO')}")
        logger.debug(f"DEBUG: {settings.DEBUG}")
        logger.debug(f"FORCE_HTTPS: {getattr(settings, 'FORCE_HTTPS', False)}")
        
        # Only redirect to HTTPS in production and when explicitly enabled
        if (not settings.DEBUG and 
            getattr(settings, 'FORCE_HTTPS', False) and 
            not request.is_secure() and 
            not request.META.get('HTTP_X_FORWARDED_PROTO') == 'https'):
            
            logger.warning(f"Redirecting to HTTPS: {request.get_full_path()}")
            # Build HTTPS URL
            https_url = f"https://{request.get_host()}{request.get_full_path()}"
            return HttpResponsePermanentRedirect(https_url)
        
        return None
