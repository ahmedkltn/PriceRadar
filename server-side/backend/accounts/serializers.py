from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password2', 'first_name', 'last_name')
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_active=True,  # Set to False if email verification is required
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'date_joined')
        read_only_fields = ('id', 'date_joined', 'username')


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom token serializer to include user info"""
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        return token


class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer for password reset request"""
    email = serializers.EmailField(required=True)


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer for password reset confirmation"""
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(
        required=True, validators=[validate_password]
    )
    new_password2 = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError(
                {"new_password": "Password fields didn't match."}
            )
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing password (authenticated user)"""
    current_password = serializers.CharField(
        write_only=True, required=True, help_text="Current password"
    )
    new_password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password],
        help_text="New password"
    )
    new_password2 = serializers.CharField(
        write_only=True, required=True, help_text="Confirm new password"
    )

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError(
                {"new_password": "New password fields didn't match."}
            )
        return attrs


class EmailVerificationSerializer(serializers.Serializer):
    """Serializer for email verification"""
    token = serializers.CharField(required=True)


class SavedProductSerializer(serializers.Serializer):
    """Serializer for saved product (basic info)"""
    id = serializers.IntegerField(read_only=True)
    product_id = serializers.IntegerField()
    saved_at = serializers.DateTimeField(read_only=True)


class SavedProductRequestSerializer(serializers.Serializer):
    """Serializer for saving a product request"""
    product_id = serializers.IntegerField(required=True)


class SavedProductDetailSerializer(serializers.Serializer):
    """Serializer for saved product with full product details"""
    id = serializers.IntegerField(read_only=True)
    product_id = serializers.IntegerField()
    saved_at = serializers.DateTimeField(read_only=True)
    product = serializers.DictField(allow_null=True)