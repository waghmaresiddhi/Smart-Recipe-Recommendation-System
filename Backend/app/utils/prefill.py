from statistics import mode
from ecommerce import models


def create_tags():
    
    tags = [
        "Nokia",
        "Samsung",
        "OnePlus",
        "Vivo",
        "Oppo"
    ]
    for t in tags:
        t, created = models.Tag.objects.update_or_create(name=t)
        print(t, "Created ", created)

def create_screen_type():
    
    screen_type = [
        "Amoled",
        "Super Amoled",
        "Oled"
    ]
    for t in screen_type:
        t, created = models.ScreenType.objects.update_or_create(name=t)
        print(t, "Created ", created)

# def create_tags():
    
#     tags = [
#         "Nokia",
#         "Samsung",
#         "OnePlus",
#         "Vivo",
#         "Oppo"
#     ]
#     for t in tags:
#         t, created = models.Tag.objects.update_or_create(name=t)
#         print(t, "Created ", created)

# def create_tags():
    
#     tags = [
#         "Nokia",
#         "Samsung",
#         "OnePlus",
#         "Vivo",
#         "Oppo"
#     ]
#     for t in tags:
#         t, created = models.Tag.objects.update_or_create(name=t)
#         print(t, "Created ", created)

# create_tags()
