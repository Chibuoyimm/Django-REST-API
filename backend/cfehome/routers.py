# typically should be in urls,py, but this is to isolate the viewsets

from rest_framework.routers import DefaultRouter
from products.viewsets import ProductGenericViewSet

router = DefaultRouter()
router.register('products', ProductGenericViewSet, basename='products')
print(router.urls)
urlpatterns = router.urls