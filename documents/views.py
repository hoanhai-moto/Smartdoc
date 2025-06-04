from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import check_password

from .models import (
    Department, JobTitle, Employee, DocumentType, 
    Archive, Document, BorrowRequest
)
from .serializers import (
    DepartmentSerializer, JobTitleSerializer, EmployeeSerializer,
    DocumentTypeSerializer, ArchiveSerializer, DocumentSerializer,
    BorrowRequestSerializer, UserSerializer
)

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name']

class JobTitleViewSet(viewsets.ModelViewSet):
    queryset = JobTitle.objects.all()
    serializer_class = JobTitleSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['title']

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'phone_number']
    ordering_fields = ['user__first_name', 'user__last_name', 'department__name', 'job_title__title']

class DocumentTypeViewSet(viewsets.ModelViewSet):
    queryset = DocumentType.objects.all()
    serializer_class = DocumentTypeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'category']
    ordering_fields = ['name', 'category']
    
    @action(detail=False, methods=['get'])
    def records(self, request):
        record_types = DocumentType.objects.filter(
            category__in=['notarized', 'certified', 'authenticated', 'translated']
        )
        serializer = self.get_serializer(record_types, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def documents(self, request):
        document_types = DocumentType.objects.filter(
            category__in=['outgoing', 'incoming', 'blocking', 'internal']
        )
        serializer = self.get_serializer(document_types, many=True)
        return Response(serializer.data)

class ArchiveViewSet(viewsets.ModelViewSet):
    queryset = Archive.objects.all()
    serializer_class = ArchiveSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'location', 'description']
    ordering_fields = ['name', 'location']

class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'document_type__name', 'uploaded_by__username']
    ordering_fields = ['title', 'created_at', 'updated_at', 'status']
    
    def get_queryset(self):
        user = self.request.user
        # Show documents uploaded by the user or shared with them
        return Document.objects.filter(
            Q(uploaded_by=user) | Q(shared_with=user)
        ).distinct()
    
    @action(detail=False, methods=['get'])
    def personal(self, request):
        personal_docs = Document.objects.filter(
            uploaded_by=request.user,
            is_personal=True
        )
        serializer = self.get_serializer(personal_docs, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def office(self, request):
        office_docs = Document.objects.filter(
            uploaded_by=request.user,
            is_personal=False
        )
        serializer = self.get_serializer(office_docs, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def shared(self, request):
        shared_docs = Document.objects.filter(
            shared_with=request.user
        )
        serializer = self.get_serializer(shared_docs, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def archived(self, request):
        archived_docs = Document.objects.filter(
            uploaded_by=request.user,
            status='archived'
        )
        serializer = self.get_serializer(archived_docs, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        document = self.get_object()
        user_ids = request.data.get('user_ids', [])
        
        if not user_ids:
            return Response(
                {"error": "No users specified for sharing"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        from django.contrib.auth.models import User
        users = User.objects.filter(id__in=user_ids)
        document.shared_with.add(*users)
        
        return Response({"status": "Document shared successfully"})
    
    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        document = self.get_object()
        archive_id = request.data.get('archive_id')
        
        if not archive_id:
            return Response(
                {"error": "No archive specified"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            archive = Archive.objects.get(id=archive_id)
            document.archive = archive
            document.status = 'archived'
            document.save()
            return Response({"status": "Document archived successfully"})
        except Archive.DoesNotExist:
            return Response(
                {"error": "Archive not found"},
                status=status.HTTP_404_NOT_FOUND
            )

class BorrowRequestViewSet(viewsets.ModelViewSet):
    serializer_class = BorrowRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['document__title', 'purpose', 'status']
    ordering_fields = ['borrow_date', 'return_date', 'status', 'created_at']
    
    def get_queryset(self):
        user = self.request.user
        # Admin sees all requests, others see only their own
        if user.is_staff:
            return BorrowRequest.objects.all()
        return BorrowRequest.objects.filter(requested_by=user)
    
    @action(detail=False, methods=['get'])
    def pending_approvals(self, request):
        if not request.user.is_staff:
            return Response(
                {"error": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        pending = BorrowRequest.objects.filter(status='pending')
        serializer = self.get_serializer(pending, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        if not request.user.is_staff:
            return Response(
                {"error": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        borrow_request = self.get_object()
        if borrow_request.status != 'pending':
            return Response(
                {"error": "Cannot approve a request that is not pending"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        borrow_request.status = 'approved'
        borrow_request.approved_by = request.user
        borrow_request.document.status = 'borrowed'
        
        borrow_request.save()
        borrow_request.document.save()
        
        return Response({"status": "Request approved"})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        if not request.user.is_staff:
            return Response(
                {"error": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        borrow_request = self.get_object()
        if borrow_request.status != 'pending':
            return Response(
                {"error": "Cannot reject a request that is not pending"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        borrow_request.status = 'rejected'
        borrow_request.approved_by = request.user
        borrow_request.save()
        
        return Response({"status": "Request rejected"})
    
    @action(detail=True, methods=['post'])
    def return_document(self, request, pk=None):
        borrow_request = self.get_object()
        
        if borrow_request.status != 'approved':
            return Response(
                {"error": "Cannot return a document that is not borrowed"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        borrow_request.status = 'returned'
        borrow_request.actual_return_date = timezone.now().date()
        borrow_request.document.status = 'active'
        
        borrow_request.save()
        borrow_request.document.save()
        
        return Response({"status": "Document returned successfully"})

# Authentication views
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    print(f"Login attempt - Username: {username}")
    
    if not username or not password:
        print("Missing username or password")
        return Response({
            'message': 'Please provide both username and password'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    
    if not user:
        print(f"Authentication failed for user: {username}")
        return Response({
            'message': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    print(f"Authentication successful for user: {username}")
    token, _ = Token.objects.get_or_create(user=user)
    
    serializer = UserSerializer(user)
    
    return Response({
        'token': token.key,
        'user': serializer.data
    })

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_view(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    
    if not username or not email or not password:
        return Response({
            'message': 'Please provide username, email and password'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(username=username).exists():
        return Response({
            'message': 'Username already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=email).exists():
        return Response({
            'message': 'Email already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name
    )
    
    token, _ = Token.objects.get_or_create(user=user)
    
    serializer = UserSerializer(user)
    
    return Response({
        'token': token.key,
        'user': serializer.data
    })

@api_view(['GET'])
def get_user_data(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def test_auth(request):
    try:
        # Get the admin user
        admin = User.objects.get(username='admin')
        
        # Check if password 'admin' would work
        password_valid = check_password('admin', admin.password)
        
        return Response({
            'admin_exists': True,
            'password_valid': password_valid,
            'admin_data': {
                'username': admin.username,
                'email': admin.email,
                'is_active': admin.is_active,
                'last_login': admin.last_login
            }
        })
    except User.DoesNotExist:
        return Response({
            'admin_exists': False,
            'message': 'Admin user does not exist'
        }) 