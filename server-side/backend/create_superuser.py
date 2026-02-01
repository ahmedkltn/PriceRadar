#!/usr/bin/env python
"""Helper script to create a superuser"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'priceradar_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_superuser():
    """Create a superuser interactively"""
    print("=" * 60)
    print("Creating Superuser Account")
    print("=" * 60)
    
    username = input("Username: ").strip()
    if not username:
        print("Username is required!")
        return
    
    email = input("Email: ").strip()
    if not email:
        print("Email is required!")
        return
    
    # Check if user already exists
    if User.objects.filter(username=username).exists():
        print(f"User '{username}' already exists!")
        response = input("Make this user a superuser? (y/n): ").strip().lower()
        if response == 'y':
            user = User.objects.get(username=username)
            user.is_superuser = True
            user.is_staff = True
            user.save()
            print(f"✓ User '{username}' is now a superuser!")
        return
    
    password = input("Password: ").strip()
    if not password:
        print("Password is required!")
        return
    
    first_name = input("First name (optional): ").strip()
    last_name = input("Last name (optional): ").strip()
    
    try:
        user = User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        print(f"\n✓ Superuser '{username}' created successfully!")
        print(f"  Email: {email}")
        print(f"  You can now login at: http://localhost:8000/admin/")
    except Exception as e:
        print(f"\n✗ Error creating superuser: {e}")

if __name__ == "__main__":
    create_superuser()
