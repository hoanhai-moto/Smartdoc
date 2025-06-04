from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Department, JobTitle, Employee, DocumentType, 
    Archive, Document, BorrowRequest
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class JobTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobTitle
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)
    job_title = JobTitleSerializer(read_only=True)
    
    class Meta:
        model = Employee
        fields = '__all__'

class DocumentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentType
        fields = '__all__'

class ArchiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Archive
        fields = '__all__'

class DocumentSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    document_type = DocumentTypeSerializer(read_only=True)
    archive = ArchiveSerializer(read_only=True)
    shared_with = UserSerializer(many=True, read_only=True)
    
    class Meta:
        model = Document
        fields = '__all__'
        
    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['uploaded_by'] = request.user
        return super().create(validated_data)

class BorrowRequestSerializer(serializers.ModelSerializer):
    requested_by = UserSerializer(read_only=True)
    approved_by = UserSerializer(read_only=True)
    document = DocumentSerializer(read_only=True)
    document_id = serializers.PrimaryKeyRelatedField(
        queryset=Document.objects.all(), 
        write_only=True, 
        source='document'
    )
    
    class Meta:
        model = BorrowRequest
        fields = '__all__'
        read_only_fields = ['status', 'actual_return_date']
        
    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['requested_by'] = request.user
        return super().create(validated_data) 