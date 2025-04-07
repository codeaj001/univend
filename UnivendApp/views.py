from django.shortcuts import render
# your_app_name/views.py
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from django.contrib.auth.hashers import make_password
from .models import CustomUser, Campus, Department
from django.http import HttpResponse

    # Create your views here.
def landing_page(request):
    if request.user.is_authenticated:
        return redirect('home')
    else:
        return render(request,'UnivendApp/landing.html')
        
def home(request):
    if request.user.is_authenticated:
        user = request.user
        campus = Campus.objects.get(name = user.campus.name )
        context = {"campus":campus}
        return render(request,'UnivendApp/homepage.html',context)
    else:
        return redirect('login_user')
        
def register_user(request):
    campuses = Campus.objects.all()
    departments = Department.objects.all()
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        username = request.POST.get('username')
        phone_number = request.POST.get('phone_number')
        email = request.POST.get('email')
        campus = request.POST.get('campus')
        department = request.POST.get('department')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        

        # Validate inputs (add more validation as needed)
        if not first_name or not last_name or not email or not password1 or not campus:
            messages.error(request, 'Please fill in all fields.')
            return render(request, 'UnivendApp/register.html', {'campuses': campuses})

        try:
            campus = Campus.objects.get(name=campus)
            department = Department.objects.get(name=department)
        except Campus.objects.get(name=campus).DoesNotExist:
            print(campus)
            messages.error(request, 'Invalid campus selected.')
            context = {"campuses":campuses, "departments":departments }
            return render(request, 'UnivendApp/register.html', context)

        # Create the user
        try:
            user = CustomUser.objects.create_user(
                username=username,
                first_name=first_name,
                last_name=last_name,
                email=email,
                phone_number=phone_number,
                campus=campus,
                department=department,
                password=password1,
                 
            )
            login(request, user)
            messages.success(request, 'Registration successful!')
            return redirect('home')  # Redirect to your home page
        except Exception as e:
            messages.error(request, f'Registration failed: {e}')
            context = {"campuses":campuses, "departments":departments }
            return render(request, 'UnivendApp/register.html', context)
    else:
        context = {"campuses":campuses, "departments": departments }
        return render(request, 'UnivendApp/register.html',context)
    
    
def login_user(request):
    if request.user.is_authenticated:
        return redirect('home')
    else:
        if request.method == 'POST':
            email = request.POST.get('loginEmail')
            password = request.POST.get('loginPassword')
            user = authenticate(request, email=email, password=password)
            
            if user is not None:
                login(request, user)
                messages.success(request, f'Logged in as {email}!')
                return redirect('home')  # Redirect to your home page
            else:
                messages.error(request, 'Invalid email or password.')
                return render(request, 'UnivendApp/index.html')
        else:
            return render(request, 'UnivendApp/index.html')


def logout_view(request):
    logout(request)
    messages.info(request, "Logged out successfully!")
    return redirect('landing_page')  # Redirect to your home page

def profile(request):
    return render(request,'UnivendApp/profile.html')