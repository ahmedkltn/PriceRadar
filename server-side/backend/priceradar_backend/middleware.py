"""
Custom middleware to handle CSRF exemption for API endpoints
"""
from django.utils.deprecation import MiddlewareMixin


class CsrfExemptApiMiddleware(MiddlewareMixin):
    """
    Middleware that exempts API endpoints from CSRF protection.
    This works alongside the CSRF middleware to allow API requests.
    """
    
    def process_request(self, request):
        # Exempt all /api/ endpoints from CSRF
        # This flag tells Django's CSRF middleware to skip all CSRF checks
        if request.path.startswith('/api/'):
            setattr(request, '_dont_enforce_csrf_checks', True)
        return None
    
    def process_view(self, request, view_func, view_args, view_kwargs):
        # Also set the flag in process_view to ensure it's set before CSRF middleware runs
        if request.path.startswith('/api/'):
            setattr(request, '_dont_enforce_csrf_checks', True)
        return None
