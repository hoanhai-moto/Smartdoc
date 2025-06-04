from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DepartmentViewSet, JobTitleViewSet, EmployeeViewSet,
    DocumentTypeViewSet, ArchiveViewSet, DocumentViewSet,
    BorrowRequestViewSet, login_view, register_view, get_user_data
)

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet)
router.register(r'job-titles', JobTitleViewSet)
router.register(r'employees', EmployeeViewSet)
router.register(r'document-types', DocumentTypeViewSet)
router.register(r'archives', ArchiveViewSet)
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'borrow-requests', BorrowRequestViewSet, basename='borrow-request')

urlpatterns = [
    path('', include(router.urls)),
    # Authentication endpoints
    path('auth/login/', login_view, name='login'),
    path('auth/register/', register_view, name='register'),
    path('users/me/', get_user_data, name='user-data'),
] 