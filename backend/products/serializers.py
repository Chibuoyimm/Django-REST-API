from rest_framework import serializers
from rest_framework.reverse import reverse

from api.serializers import UserPublicSerializer
from .models import Product
from . import validators


class ProductInLineSerializer(serializers.Serializer):
    url = serializers.HyperlinkedIdentityField(view_name='product-detail', lookup_field='pk', read_only=True)
    title = serializers.CharField(read_only=True)


class ProductSerializer(serializers.ModelSerializer):
    owner = UserPublicSerializer(source='user', read_only=True)
    edit_url = serializers.SerializerMethodField(read_only=True)
    url = serializers.HyperlinkedIdentityField(view_name='product-detail', lookup_field='pk')

    title = serializers.CharField(validators=[validators.validate_title_no_hello, validators.unique_product_title])
    # email = serializers.EmailField(source='user.email', read_only=True)
    body = serializers.CharField(source='content')

    class Meta:
        model = Product
        fields = [
            'owner',
            'url',
            'edit_url',
            'pk',
            'title',
            'body',
            'price',
            'sale_price',
            'public',
            'path',
            'endpoint'
        ]

    # def validate_title(self, value):
    #     request = self.context.get('request')
    #     user = request.user
    #     qs = Product.objects.filter(user=user, title__iexact=value)  # checks if the title exists already in a model instance and is case insensitive
    #     if qs.exists():
    #         raise serializers.ValidationError(f'{value} is already a product name')
    #     return value

    # def create(self, validated_data):
    #     # email = validated_data.pop('email')
    #     obj = super().create(validated_data)
    #     # print(email, obj)
    #     return obj
    #
    # def update(self, instance, validated_data):
    #     email = validated_data.pop('email')
    #     return super().update(instance, validated_data)

    def get_edit_url(self, obj):
        # return f'api/products/{obj.pk}'
        request = self.context.get('request')
        if request is None:
            return None
        return reverse('product-edit', kwargs={'pk': obj.pk}, request=request)

    # def get_my_discount(self, obj):
    #     try:
    #         return obj.get_discount()
    #     except:
    #         return None