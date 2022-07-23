from rest_framework import generics

from .models import Article
from .serializers import ArticleSerializer


class ArticleListView(generics.ListAPIView):
    queryset = Article.objects.public()
    serializer_class = ArticleSerializer


class ArticleDetailView(generics.RetrieveAPIView):
    queryset = Article.objects.public()
    serializer_class = ArticleSerializer
