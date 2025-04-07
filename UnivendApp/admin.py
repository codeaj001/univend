from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from django.urls import reverse
from django.db.models import Count, Avg
from .models import (
    CustomUser, Campus, Department, KYC, Category, Product, ProductImage,
    Service, ServiceImage, Review, Cart, CartItem, Order, OrderItem,
    Conversation, Message, CustomUser
)

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'campus', 
                   'department', 'is_active', 'date_joined')
    list_filter = ('is_active', 'is_staff', 'campus', 'department', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    # Customize the admin form to include all fields
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email', 
                                    'phone_number', 'profile_picture', 'bio')}),
        ('Academic Info', {'fields': ('campus', 'department')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 
                                  'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'campus', 
                      'department', 'first_name', 'last_name', 'phone_number'),
        }),
    )

@admin.register(Campus)
class CampusAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'total_students', 'total_products', 'total_services')
    search_fields = ('name', 'location')

    def total_students(self, obj):
        return CustomUser.objects.filter(campus=obj).count()
    
    def total_products(self, obj):
        return Product.objects.filter(campus=obj).count()
    
    def total_services(self, obj):
        return Service.objects.filter(campus=obj).count()

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'campus', 'code', 'total_students')
    list_filter = ('campus',)
    search_fields = ('name', 'code')

    def total_students(self, obj):
        return CustomUser.objects.filter(department=obj).count()

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'seller', 'price', 'category', 'campus', 'is_available', 'created_at')
    list_filter = ('is_available', 'category', 'campus', 'created_at')
    search_fields = ('title', 'description', 'seller__username')
    inlines = [ProductImageInline]
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'seller', 'price')
        }),
        ('Classification', {
            'fields': ('category', 'campus')
        }),
        ('Status', {
            'fields': ('is_available', 'quantity')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

class ServiceImageInline(admin.TabularInline):
    model = ServiceImage
    extra = 1

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'provider', 'price', 'category', 'campus', 'is_available', 'delivery_time')
    list_filter = ('is_available', 'category', 'campus', 'created_at')
    search_fields = ('title', 'description', 'provider__username')
    inlines = [ServiceImageInline]
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'total_products', 'total_services', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name',)

    def total_products(self, obj):
        return Product.objects.filter(category=obj).count()
    
    def total_services(self, obj):
        return Service.objects.filter(category=obj).count()

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_item', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('user__username', 'comment')
    
    def get_item(self, obj):
        if obj.product:
            return f"Product: {obj.product.title}"
        return f"Service: {obj.service.title}"
    get_item.short_description = 'Reviewed Item'

@admin.register(KYC)
class KYCAdmin(admin.ModelAdmin):
    list_display = ('user', 'matric_number', 'is_verified', 'submitted_at', 'verified_at')
    list_filter = ('is_verified', 'submitted_at', 'verified_at')
    search_fields = ('user__username', 'matric_number')
    readonly_fields = ('submitted_at',)

    def save_model(self, request, obj, form, change):
        if 'is_verified' in form.changed_data and obj.is_verified:
            obj.verified_at = timezone.now()
        super().save_model(request, obj, form, change)

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 1

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'item_count', 'total_value')
    search_fields = ('user__username',)
    inlines = [CartItemInline]

    def item_count(self, obj):
        return obj.cartitem_set.count()

    def total_value(self, obj):
        total = 0
        for item in obj.cartitem_set.all():
            if item.product:
                total += item.product.price * item.quantity
            elif item.service:
                total += item.service.price * item.quantity
        return f"${total:.2f}"

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('price',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'id')
    inlines = [OrderItemInline]
    readonly_fields = ('created_at', 'updated_at')

# @admin.register(UserProfile)
# class UserProfileAdmin(admin.ModelAdmin):
#     list_display = ('user', 'campus', 'department', 'date_joined')
#     list_filter = ('campus', 'department')

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_participants', 'created_at', 'message_count')
    search_fields = ('participants__username',)
    
    def get_participants(self, obj):
        return ", ".join([user.username for user in obj.participants.all()])
    get_participants.short_description = 'Participants'
    
    def message_count(self, obj):
        return obj.message_set.count()

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'conversation', 'content_preview', 'created_at', 'is_read')
    list_filter = ('is_read', 'created_at')
    search_fields = ('sender__username', 'content')
    
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content

# Customize admin site header and title
admin.site.site_header = "Campus Marketplace Administration"
admin.site.site_title = "Campus Marketplace Admin Portal"
admin.site.index_title = "Welcome to Campus Marketplace Admin Portal"

# Optional: Add admin actions
@admin.action(description='Mark selected items as available')
def make_available(modeladmin, request, queryset):
    queryset.update(is_available=True)

@admin.action(description='Mark selected items as unavailable')
def make_unavailable(modeladmin, request, queryset):
    queryset.update(is_available=False)

# Add these actions to Product and Service admin
ProductAdmin.actions = [make_available, make_unavailable]
ServiceAdmin.actions = [make_available, make_unavailable]