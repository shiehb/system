#!/usr/bin/env python3
"""
Test script to verify authentication is working
Run this from your Django project root: python test_auth.py
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_authentication():
    print("Testing Django Authentication...")
    
    # Test data
    login_data = {
        "email": "admin@example.com",  # Replace with your admin email
        "password": "12345678"  # Replace with your admin password
    }
    
    session = requests.Session()
    
    # Test login
    print("\n1. Testing login...")
    login_response = session.post(f"{BASE_URL}/login/", json=login_data)
    print(f"Login Status: {login_response.status_code}")
    print(f"Login Response: {login_response.text}")
    
    if login_response.status_code == 200:
        print("✅ Login successful!")
        
        # Test authenticated endpoint
        print("\n2. Testing authenticated endpoint...")
        auth_response = session.get(f"{BASE_URL}/authenticated/")
        print(f"Auth Status: {auth_response.status_code}")
        print(f"Auth Response: {auth_response.text}")
        
        if auth_response.status_code == 200:
            print("✅ Authentication working!")
        else:
            print("❌ Authentication failed!")
            
        # Test token refresh
        print("\n3. Testing token refresh...")
        refresh_response = session.post(f"{BASE_URL}/token/refresh/")
        print(f"Refresh Status: {refresh_response.status_code}")
        print(f"Refresh Response: {refresh_response.text}")
        
        if refresh_response.status_code == 200:
            print("✅ Token refresh working!")
        else:
            print("❌ Token refresh failed!")
            
    else:
        print("❌ Login failed!")
        print("Make sure you have a user account created")

if __name__ == "__main__":
    test_authentication()
