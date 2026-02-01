from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.urls import reverse


def send_verification_email(user, request=None):
    """Send email verification email to user"""
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    # Build verification URL - always use frontend URL since the link should point to frontend
    # Frontend route: /verify-email/:uid/:token
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:6080')
    verification_url = f'{frontend_url}/verify-email/{uid}/{token}'
    
    context = {
        'user': user,
        'verification_url': verification_url,
        'site_name': 'PriceRadar',
    }
    
    html_message = render_to_string('emails/verification.html', context)
    plain_message = f'Please verify your email by clicking: {verification_url}'
    
    send_mail(
        subject='Verify your PriceRadar account',
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_password_reset_email(user, request=None):
    """Send password reset email to user"""
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    # Build reset URL - always use frontend URL since the link should point to frontend
    # Frontend route: /reset-password/:uid/:token
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:6080')
    reset_url = f'{frontend_url}/reset-password/{uid}/{token}'
    
    context = {
        'user': user,
        'reset_url': reset_url,
        'site_name': 'PriceRadar',
    }
    
    html_message = render_to_string('emails/password_reset.html', context)
    plain_message = f'Reset your password by clicking: {reset_url}'
    
    send_mail(
        subject='Reset your PriceRadar password',
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_welcome_email(user):
    """Send welcome email to newly registered user"""
    context = {
        'user': user,
        'site_name': 'PriceRadar',
        'site_url': getattr(settings, 'FRONTEND_URL', 'http://localhost:6080'),
    }
    
    html_message = render_to_string('emails/welcome.html', context)
    plain_message = f'Welcome to {context["site_name"]}, {user.first_name or user.username}!'
    
    send_mail(
        subject=f'Welcome to {context["site_name"]}!',
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_contact_email(name, email, message, subject=None):
    """Send contact form email to admin"""
    context = {
        'name': name,
        'email': email,
        'message': message,
        'subject': subject or 'Contact Form Submission',
        'site_url': getattr(settings, 'FRONTEND_URL', 'http://localhost:6080'),
    }
    
    html_message = render_to_string('emails/contact.html', context)
    plain_message = f'Contact from {name} ({email}):\n\n{message}'
    
    contact_email = getattr(settings, 'CONTACT_EMAIL', settings.DEFAULT_FROM_EMAIL)
    send_mail(
        subject=f'Contact Form: {context["subject"]}',
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[contact_email],
        html_message=html_message,
        fail_silently=False,
    )
