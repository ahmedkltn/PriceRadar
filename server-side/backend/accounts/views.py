from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes

from .serializers import (
    UserRegistrationSerializer,
    UserProfileSerializer,
    CustomTokenObtainPairSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    ChangePasswordSerializer,
    EmailVerificationSerializer,
    SavedProductSerializer,
    SavedProductRequestSerializer,
    SavedProductDetailSerializer,
)
from .models import SavedProduct
from .utils import (
    send_verification_email,
    send_password_reset_email,
    send_welcome_email,
)

User = get_user_model()


@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    """User registration endpoint"""
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=UserRegistrationSerializer,
        responses={201: UserProfileSerializer},
        examples=[
            OpenApiExample(
                'Registration Example',
                value={
                    'username': 'johndoe',
                    'email': 'john@example.com',
                    'password': 'securepass123',
                    'password2': 'securepass123',
                    'first_name': 'John',
                    'last_name': 'Doe'
                },
                request_only=True,
            ),
        ],
    )
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Send welcome email
            try:
                send_welcome_email(user)
            except Exception as e:
                # Log error but don't fail registration
                print(f"Failed to send welcome email: {e}")
            
            # Send verification email
            try:
                send_verification_email(user, request)
            except Exception as e:
                # Log error but don't fail registration
                print(f"Failed to send verification email: {e}")
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserProfileSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                'message': 'Registration successful. Please verify your email.',
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom login view with user info in response"""
    serializer_class = CustomTokenObtainPairSerializer

    @extend_schema(
        request=CustomTokenObtainPairSerializer,
        responses={200: OpenApiTypes.OBJECT},
        examples=[
            OpenApiExample(
                'Login Example',
                value={
                    'username': 'johndoe',
                    'password': 'securepass123'
                },
                request_only=True,
            ),
        ],
    )
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            # Get user from validated data
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.user
            
            response.data['user'] = UserProfileSerializer(user).data
        
        return response


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update current user profile"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        responses={200: UserProfileSerializer},
        summary='Get current user profile',
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        request=UserProfileSerializer,
        responses={200: UserProfileSerializer},
        summary='Update current user profile',
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    def get_object(self):
        return self.request.user


@method_decorator(csrf_exempt, name='dispatch')
class PasswordResetRequestView(APIView):
    """Request password reset email"""
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=PasswordResetRequestSerializer,
        responses={200: OpenApiTypes.OBJECT},
        examples=[
            OpenApiExample(
                'Password Reset Request',
                value={'email': 'user@example.com'},
                request_only=True,
            ),
        ],
    )
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
                send_password_reset_email(user, request)
                return Response({
                    'message': 'Password reset email has been sent.'
                }, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                # Don't reveal if email exists for security
                return Response({
                    'message': 'If an account exists with this email, a password reset link has been sent.'
                }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class PasswordResetConfirmView(APIView):
    """Confirm password reset with token"""
    permission_classes = [permissions.AllowAny]

    def post(self, request, uidb64=None, token=None):
        # Get uid and token from URL or request data
        uidb64 = uidb64 or request.data.get('uid')
        token = token or request.data.get('token')
        
        if not uidb64 or not token:
            return Response(
                {'error': 'UID and token are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        
        if user and default_token_generator.check_token(user, token):
            serializer = PasswordResetConfirmSerializer(data=request.data)
            if serializer.is_valid():
                new_password = serializer.validated_data['new_password']
                user.set_password(new_password)
                user.save()
                return Response({
                    'message': 'Password has been reset successfully.'
                }, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(
            {'error': 'Invalid or expired reset token.'},
            status=status.HTTP_400_BAD_REQUEST
        )


@method_decorator(csrf_exempt, name='dispatch')
class ChangePasswordView(APIView):
    """Change password for authenticated user"""
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        request=ChangePasswordSerializer,
        responses={200: OpenApiTypes.OBJECT},
        examples=[
            OpenApiExample(
                'Change Password',
                value={
                    'current_password': 'oldpass123',
                    'new_password': 'newsecurepass123',
                    'new_password2': 'newsecurepass123'
                },
                request_only=True,
            ),
        ],
    )
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            current_password = serializer.validated_data['current_password']
            new_password = serializer.validated_data['new_password']
            
            # Verify current password
            if not user.check_password(current_password):
                return Response(
                    {'error': 'Current password is incorrect.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Set new password
            user.set_password(new_password)
            user.save()
            
            return Response({
                'message': 'Password has been changed successfully.'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class EmailVerificationView(APIView):
    """Verify user email with token"""
    permission_classes = [permissions.AllowAny]

    def post(self, request, uidb64=None, token=None):
        # Get uid and token from URL or request data
        uidb64 = uidb64 or request.data.get('uid')
        token = token or request.data.get('token')
        
        if not uidb64 or not token:
            return Response(
                {'error': 'UID and token are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        
        if user and default_token_generator.check_token(user, token):
            user.is_active = True
            # You can add email_verified field if using custom user model
            user.save()
            return Response({
                'message': 'Email verified successfully.'
            }, status=status.HTTP_200_OK)
        
        return Response(
            {'error': 'Invalid or expired verification token.'},
            status=status.HTTP_400_BAD_REQUEST
        )


@method_decorator(csrf_exempt, name='dispatch')
class SavedProductsListView(APIView):
    """List and create saved products for authenticated user"""
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        responses={200: SavedProductDetailSerializer(many=True)},
        summary='List saved products',
    )
    def get(self, request):
        """Get all saved products for the current user"""
        saved_products = SavedProduct.objects.filter(user=request.user)
        
        # Fetch product details for each saved product
        from pricing.models import DimProduct
        from django.db.models import OuterRef, Subquery
        from pricing.models import OfferProductMap, VLastestOfferPrices, CoreOffers, DimVendorSubcategory
        
        result = []
        for saved_product in saved_products:
            try:
                product = DimProduct.objects.get(product_id=saved_product.product_id)
                
                # Get product details similar to ProductDetailView
                mapped_offer_ids = OfferProductMap.objects.filter(
                    product_id=product.product_id
                ).values_list("offer_id", flat=True)
                
                latest_price_qs = VLastestOfferPrices.objects.filter(
                    offer_id=OuterRef("offer_id")
                )
                
                subcat_qs = DimVendorSubcategory.objects.filter(
                    vendor_subcategory_id=OuterRef("vendor_subcategory_id")
                )
                
                offers_qs = (
                    CoreOffers.objects
                    .filter(offer_id__in=mapped_offer_ids)
                    .annotate(
                        price_value=Subquery(latest_price_qs.values("price_value")[:1]),
                        currency=Subquery(latest_price_qs.values("currency")[:1]),
                        observed_at=Subquery(latest_price_qs.values("observed_at")[:1]),
                        category_id=Subquery(subcat_qs.values("vendor_category_id")[:1]),
                        category_name=Subquery(subcat_qs.values("vendor_category_name")[:1]),
                        subcategory_name=Subquery(subcat_qs.values("vendor_subcategory_name")[:1]),
                    )
                    .exclude(price_value__isnull=True)
                )
                
                cheapest = offers_qs.order_by("price_value").first()
                cheapest_offer = None
                if cheapest:
                    cheapest_offer = {
                        "vendor": cheapest.vendor,
                        "price": str(cheapest.price_value),
                        "url": cheapest.url,
                        "scraped_at": cheapest.observed_at.isoformat() if cheapest.observed_at else None,
                        "currency": cheapest.currency,
                    }
                
                product_data = {
                    "product_id": product.product_id,
                    "name": product.display_name,
                    "category": getattr(cheapest, "category_name", None) if cheapest else None,
                    "category_id": getattr(cheapest, "category_id", None) if cheapest else None,
                    "subcategory": getattr(cheapest, "subcategory_name", None) if cheapest else None,
                    "subcategory_id": getattr(cheapest, "vendor_subcategory_id", None) if cheapest else None,
                    "brand": None,
                    "description": None,
                    "image_url": product.display_image_url,
                    "currency": getattr(cheapest, "currency", None) if cheapest else None,
                    "cheapest_offer": cheapest_offer,
                    "offers_count": offers_qs.count(),
                    "price": str(cheapest.price_value) if cheapest and cheapest.price_value else None,
                }
                
                result.append({
                    "id": saved_product.id,
                    "product_id": saved_product.product_id,
                    "saved_at": saved_product.saved_at,
                    "product": product_data,
                })
            except DimProduct.DoesNotExist:
                # Product doesn't exist anymore, skip it
                continue
        
        serializer = SavedProductDetailSerializer(result, many=True)
        return Response({"saved_products": serializer.data}, status=status.HTTP_200_OK)

    @extend_schema(
        request=SavedProductRequestSerializer,
        responses={201: SavedProductSerializer},
        summary='Save a product',
    )
    def post(self, request):
        """Save a product for the current user"""
        serializer = SavedProductRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        product_id = serializer.validated_data['product_id']
        
        # Check if product exists
        from pricing.models import DimProduct
        try:
            DimProduct.objects.get(product_id=product_id)
        except DimProduct.DoesNotExist:
            return Response(
                {"error": "Product not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if already saved
        saved_product, created = SavedProduct.objects.get_or_create(
            user=request.user,
            product_id=product_id
        )
        
        if not created:
            return Response(
                {"error": "Product is already saved."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        result_serializer = SavedProductSerializer(saved_product)
        return Response(result_serializer.data, status=status.HTTP_201_CREATED)


@method_decorator(csrf_exempt, name='dispatch')
class SavedProductDetailView(APIView):
    """Delete a saved product"""
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        responses={200: OpenApiTypes.OBJECT},
        summary='Remove a saved product',
    )
    def delete(self, request, product_id):
        """Remove a saved product for the current user"""
        try:
            saved_product = SavedProduct.objects.get(
                user=request.user,
                product_id=product_id
            )
            saved_product.delete()
            return Response(
                {"message": "Product removed from saved list."},
                status=status.HTTP_200_OK
            )
        except SavedProduct.DoesNotExist:
            return Response(
                {"error": "Product not found in saved list."},
                status=status.HTTP_404_NOT_FOUND
            )


@method_decorator(csrf_exempt, name='dispatch')
class ContactView(APIView):
    """Handle contact form submissions"""
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=OpenApiTypes.OBJECT,
        responses={200: OpenApiTypes.OBJECT},
        examples=[
            OpenApiExample(
                'Contact Form',
                value={
                    'name': 'John Doe',
                    'email': 'john@example.com',
                    'message': 'Hello, I have a question...',
                    'subject': 'General Inquiry'
                },
                request_only=True,
            ),
        ],
    )
    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        message = request.data.get('message')
        subject = request.data.get('subject', 'Contact Form Submission')
        
        if not all([name, email, message]):
            return Response(
                {'error': 'Name, email, and message are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from .utils import send_contact_email
            send_contact_email(name, email, message, subject)
            return Response({
                'message': 'Thank you for contacting us. We will get back to you soon.'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': 'Failed to send message. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
